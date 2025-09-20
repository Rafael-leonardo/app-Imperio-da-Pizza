import React, { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useCarrinho } from "../contexts/carrinhoContext";
import api from "../services/api";

export default function Carrinho() {
  const router = useRouter();
  const { nome, telefone, tipo, cep, rua, numero, bairro } = useLocalSearchParams();
  const { carrinho, removerDoCarrinho, limparCarrinho } = useCarrinho();

  const [formaPagamento, setFormaPagamento] = useState<"dinheiro" | "cartao" | "pix" | null>(null);

  const calcularTotal = () => {
    let total = 0;
    carrinho.forEach((item) => {
      const precoNumber = Number(item.produto.preco.replace("R$ ", "").replace(",", "."));
      total += precoNumber * item.qtd;
    });
    return total.toFixed(2).replace(".", ",");
  };

  const finalizarPedido = async () => {
    if (carrinho.length === 0) return;
    if (!formaPagamento) {
      Alert.alert("Atenção", "Selecione uma forma de pagamento");
      return;
    }

    try {
      const itens = carrinho.map((item) => ({
        produtoId: item.produto.id,
        quantidade: item.qtd,
        preco: Number(item.produto.preco.replace("R$ ", "").replace(",", ".")),
        observacao: item.observacao || null,
      }));

      const response = await api.post("/pedidos", {
        nome_cliente: nome,
        telefone,
        cep: cep || null,
        rua: rua || null,
        numero: numero || null,
        bairro: bairro || null,
        forma_pagamento: formaPagamento,
        total: Number(calcularTotal().replace(",", ".")),
        itens,
      });

      const pedidoCriado = response.data;
      limparCarrinho();
      
      router.push(`/nota-fiscal?pedidoId=${pedidoCriado.id}`);

    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível finalizar o pedido");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Carrinho",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.container}>
        {carrinho.length === 0 ? (
          <Text style={styles.vazio}>Seu carrinho está vazio</Text>
        ) : (
          <FlatList
            data={carrinho}
            keyExtractor={(item) => item.produto.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.nome}>{item.produto.nome}</Text>
                <Text style={styles.observacao}> {item.observacao}</Text>
                <Text style={styles.qtd}>Qtd: {item.qtd}</Text>
                <Text style={styles.preco}>{item.produto.preco}</Text>
                <Pressable
                  style={styles.removerBtn}
                  onPress={() => removerDoCarrinho(item.produto.id)}
                >
                  <Text style={styles.removerText}>Remover</Text>
                </Pressable>
              </View>
            )}
          />
        )}

        {carrinho.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.total}>Total: R$ {calcularTotal()}</Text>

            <Text style={styles.pagamentoTitulo}>Forma de pagamento:</Text>
            <View style={styles.pagamentoContainer}>
              <Pressable
                style={[
                  styles.pagamentoBtn,
                  formaPagamento === "dinheiro" && styles.pagamentoAtivo,
                ]}
                onPress={() => setFormaPagamento("dinheiro")}
              >
                <Text style={styles.pagamentoText}>Dinheiro</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.pagamentoBtn,
                  formaPagamento === "cartao" && styles.pagamentoAtivo,
                ]}
                onPress={() => setFormaPagamento("cartao")}
              >
                <Text style={styles.pagamentoText}>Cartão</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.pagamentoBtn,
                  formaPagamento === "pix" && styles.pagamentoAtivo,
                ]}
                onPress={() => setFormaPagamento("pix")}
              >
                <Text style={styles.pagamentoText}>Pix</Text>
              </Pressable>
            </View>

            <Pressable style={styles.finalizarBtn} onPress={finalizarPedido}>
              <Text style={styles.finalizarText}>Finalizar Pedido</Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  vazio: { color: "#fff", fontSize: 18, textAlign: "center", marginTop: 50 },

  item: {
    backgroundColor: "#171414",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  nome: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  qtd: { fontSize: 14, color: "#fff", marginTop: 4 },
  preco: { fontSize: 14, fontWeight: "600", color: "#e60000", marginTop: 4 },
  removerBtn: {
    marginTop: 8,
    backgroundColor: "#e60000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  observacao:{ color: "#fff"},
  removerText: { color: "#fff", fontWeight: "bold" },

  totalContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#171414",
    borderRadius: 12,
    alignItems: "center",
  },
  total: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 12 },

  pagamentoTitulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  pagamentoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    width: "100%",
  },
  pagamentoBtn: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pagamentoAtivo: {
    backgroundColor: "#e60000",
  },
  pagamentoText: { color: "#fff", fontWeight: "bold" },

  finalizarBtn: {
    backgroundColor: "#e60000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  finalizarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
