import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import { Stack } from "expo-router";
import api from "../../frontend/services/api.js";
import moment from "moment";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao: string;
  img: string | null;
  categoria: string;
}

interface ItemPedido {
  id: number;
  quantidade: number;
  preco: number;
  observacao: string | null;
  Produto: Produto;
}

interface Pedido {
  id: number;
  nome_cliente: string;
  telefone: string;
  status: string;
  total: number;
  taxa_entrega?: number;
  itens: ItemPedido[];
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<string | null>("pendente");

  const fetchPedidos = async () => {
    try {
      const response = await api.get("/pedidos");
      setPedidos(response.data);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os pedidos");
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const alterarStatus = async (pedido: Pedido, novoStatus: string) => {
    try {
      await api.put(`/pedidos/${pedido.id}/status`, { status: novoStatus });
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedido.id ? { ...p, status: novoStatus } : p))
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o status do pedido");
    }
  };

  const imprimirPedido = (pedido: Pedido) => {
    const dataHora = moment().format("DD/MM/YYYY HH:mm");

    let nota = `\n=== Império da Pizza ===\n`;
    nota += `Data/Hora: ${dataHora}\n`;
    nota += `Pedido Nº: ${pedido.id}\n\n`;

    pedido.itens.forEach((it) => {
      nota += `• ${it.Produto ? it.Produto.nome : "Produto"} x${it.quantidade}\n`;
      if (it.observacao) {
        nota += `  - Obs: ${it.observacao}\n`;
      }
    });

    nota += `\nTaxa de entrega: R$${pedido.taxa_entrega?.toFixed(2) || "0.00"}\n`;
    nota += `Total: R$${pedido.total.toFixed(2)}\n`;
    nota += `=========================\n`;

    console.log(nota);
  };

  const renderItem = ({ item }: { item: Pedido }) => (
    <View style={styles.pedido}>
      <Text style={styles.titulo}>Pedido #{item.id}</Text>
      <Text>Cliente: {item.nome_cliente}</Text>
      <Text>Telefone: {item.telefone}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Total: R${item.total.toFixed(2)}</Text>

      <Text>Itens:</Text>
      {item.itens.map((it) => (
        <Text key={it.id} style={styles.item}>
          • {it.Produto ? it.Produto.nome : "Produto não encontrado"} x{it.quantidade} - R$
          {(it.preco * it.quantidade).toFixed(2)} {it.observacao ? `(Obs: ${it.observacao})` : ""}
        </Text>
      ))}

      <View style={styles.botoesLinha}>
        <Pressable
          style={[styles.botao, { backgroundColor: "#17a2b8" }]}
          onPress={() => alterarStatus(item, "em preparo")}
        >
          <Text style={styles.textoBotao}>Em preparo</Text>
        </Pressable>
        <Pressable
          style={[styles.botao, { backgroundColor: "#ffc107" }]}
          onPress={() => alterarStatus(item, "saiu para entrega")}
        >
          <Text style={styles.textoBotao}>Saiu p/ entrega</Text>
        </Pressable>
        <Pressable
          style={[styles.botao, { backgroundColor: "#28a745" }]}
          onPress={() => alterarStatus(item, "finalizado")}
        >
          <Text style={styles.textoBotao}>Finalizado</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.botao, { backgroundColor: "#007bff", marginTop: 5 }]}
        onPress={() => imprimirPedido(item)}
      >
        <Text style={styles.textoBotao}>Imprimir Pedido</Text>
      </Pressable>
    </View>
  );

  const pedidosFiltrados = filtro ? pedidos.filter((p) => p.status === filtro) : pedidos;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Admin - Pedidos" }} />

      <View style={styles.botoesFiltro}>
        <Pressable
          style={[styles.botaoFiltro, filtro === "pendente" && styles.botaoFiltroAtivo]}
          onPress={() => setFiltro("pendente")}
        >
          <Text style={styles.textoBotaoFiltro}>Pendentes</Text>
        </Pressable>
        <Pressable
          style={[styles.botaoFiltro, filtro === "em preparo" && styles.botaoFiltroAtivo]}
          onPress={() => setFiltro("em preparo")}
        >
          <Text style={styles.textoBotaoFiltro}>Em preparo</Text>
        </Pressable>
        <Pressable
          style={[styles.botaoFiltro, filtro === "saiu para entrega" && styles.botaoFiltroAtivo]}
          onPress={() => setFiltro("saiu para entrega")}
        >
          <Text style={styles.textoBotaoFiltro}>Saiu p/ entrega</Text>
        </Pressable>
        <Pressable
          style={[styles.botaoFiltro, filtro === "finalizado" && styles.botaoFiltroAtivo]}
          onPress={() => setFiltro("finalizado")}
        >
          <Text style={styles.textoBotaoFiltro}>Finalizados</Text>
        </Pressable>
      </View>

      <FlatList
        data={pedidosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Nenhum pedido encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  botoesFiltro: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
  botaoFiltro: { padding: 8, borderRadius: 6, backgroundColor: "#ccc" },
  botaoFiltroAtivo: { backgroundColor: "#007bff" },
  textoBotaoFiltro: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  pedido: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  titulo: { fontWeight: "bold", fontSize: 16 },
  item: { marginLeft: 8 },
  botao: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  botoesLinha: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
});
