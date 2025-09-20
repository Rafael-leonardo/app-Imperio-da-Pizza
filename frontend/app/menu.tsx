import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  SectionList,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import api from "../services/api";
import { useCarrinho } from "../contexts/carrinhoContext";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  descricao: string;
  img: string;
  categoria: "Promocoes" | "Pizza" | "Esfihas" | "Bebidas";
}

export default function Vendas() {
  const router = useRouter();
  const { nome, telefone, tipo, cep, rua, numero, bairro } = useLocalSearchParams();
  const { carrinho, setCarrinho } = useCarrinho();
  const [categoria, setCategoria] = useState<Produto["categoria"] | null>(null);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [observacao, setObservacao] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [modalLetrasVisivel, setModalLetrasVisivel] = useState(false);
  const sectionListRef = useRef<SectionList>(null);

  const categorias: Produto["categoria"][] = ["Promocoes", "Pizza", "Esfihas", "Bebidas"];
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/");
        setProdutos(response.data);
      } catch (err) {
        console.log("Erro ao buscar produtos:", err);
        Alert.alert("Erro", "Não foi possível carregar os produtos.");
      }
    };
    fetchProdutos();
  }, []);

  const adicionarAoCarrinho = () => {
    if (!produtoSelecionado) return;
    setCarrinho([
      ...carrinho,
      {
        produto: produtoSelecionado,
        qtd: quantidade,
        observacao: observacao || null,
      },
    ]);
    setProdutoSelecionado(null);
    setQuantidade(1);
    setObservacao("");
    Alert.alert("Adicionado", "Produto adicionado ao carrinho!");
  };

  const irParaCarrinho = () => {
    router.push({
      pathname: "/carrinho",
      params: { nome, telefone, tipo, cep, rua, numero, bairro },
    });
  };

  // Filtrar e ordenar produtos
  const produtosFiltrados = produtos
    .filter((p) => p.categoria === categoria)
    .filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome));

  // Agrupar por letra inicial
  const produtosPorLetra = letras
    .map((letra) => ({
      title: letra,
      data: produtosFiltrados.filter((p) => p.nome.toUpperCase().startsWith(letra)),
    }))
    .filter((section) => section.data.length > 0);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        {!categoria ? (
          <View style={styles.introContainer}>
            <Text style={styles.pergunta}>Hoje vai de quê?</Text>
            <View style={styles.opcoes}>
              {categorias.map((opcao) => (
                <Pressable
                  key={opcao}
                  style={styles.boxOpcao}
                  onPress={() => setCategoria(opcao)}
                >
                  <Text style={styles.opcaoTexto}>{opcao}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {/* Categorias topo */}
            <View style={styles.opcoesTopo}>
              {categorias.map((cat) => (
                <Pressable
                  key={cat}
                  style={[styles.boxOpcaoTopo, categoria === cat && styles.boxOpcaoAtiva]}
                  onPress={() => setCategoria(cat)}
                >
                  <Text style={[styles.opcaoTexto, categoria === cat && styles.opcaoTextoAtiva]}>
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Barra de busca */}
            <TextInput
              style={styles.inputBusca}
              placeholder="Buscar produto..."
              placeholderTextColor="#999"
              value={busca}
              onChangeText={setBusca}
            />

            {/* Lista com seções por letra */}
            <View style={{ flex: 1, flexDirection: "row" }}>
              <SectionList
                ref={sectionListRef}
                sections={produtosPorLetra}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable style={styles.card} onPress={() => setProdutoSelecionado(item)}>
                    <Image source={{ uri: item.img }} style={styles.produtoImg} />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.produtoNome}>{item.nome}</Text>
                      <Text style={styles.descricao}>{item.descricao}</Text>
                      <Text style={styles.produtoPreco}>R${item.preco}</Text>
                    </View>
                  </Pressable>
                )}
                renderSectionHeader={({ section: { title } }) => (
                  <Pressable onPress={() => setModalLetrasVisivel(true)}>
                    <Text style={styles.sectionHeader}>{title}</Text>
                  </Pressable>
                )}
                contentContainerStyle={styles.scroll}
              />
            </View>

            {carrinho.length > 0 && (
              <Pressable style={styles.btnCarrinho} onPress={irParaCarrinho}>
                <Text style={styles.btnCarrinhoText}>Ver Carrinho ({carrinho.length})</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Modal de letras */}
      <Modal
        visible={modalLetrasVisivel}
        animationType="fade"
        transparent
        onRequestClose={() => setModalLetrasVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Ir para letra</Text>
            <ScrollView contentContainerStyle={styles.letrasGrid}>
              {produtosPorLetra.map((section, idx) => (
                <Pressable
                  key={section.title}
                  style={styles.letraBtn}
                  onPress={() => {
                    setModalLetrasVisivel(false);
                    setTimeout(() => {
                      sectionListRef.current?.scrollToLocation({
                        sectionIndex: idx,
                        itemIndex: 0,
                        viewPosition: 0, 
                        animated: true,
                      });
                    }, 100); 
                  }}
                >
                  <Text style={styles.letraTexto}>{section.title}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.fecharBtn} onPress={() => setModalLetrasVisivel(false)}>
              <Text style={styles.fecharTexto}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal produto */}
      <Modal visible={!!produtoSelecionado} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Pressable style={styles.closeBtn} onPress={() => setProdutoSelecionado(null)}>
              <Text style={styles.closeText}>X</Text>
            </Pressable>

            {produtoSelecionado && (
              <>
                <Image source={{ uri: produtoSelecionado.img }} style={styles.modalImg} />
                <Text style={styles.modalNome}>{produtoSelecionado.nome}</Text>
                <Text style={styles.descricao}>{produtoSelecionado.descricao}</Text>
                <Text style={styles.modalPreco}>R${produtoSelecionado.preco}</Text>

                <View style={styles.qtdContainer}>
                  <Pressable
                    style={styles.qtdBtn}
                    onPress={() => setQuantidade((q) => Math.max(1, q - 1))}
                  >
                    <Text style={styles.qtdBtnText}>-</Text>
                  </Pressable>
                  <Text style={styles.qtdText}>{quantidade}</Text>
                  <Pressable
                    style={styles.qtdBtn}
                    onPress={() => setQuantidade((q) => q + 1)}
                  >
                    <Text style={styles.qtdBtnText}>+</Text>
                  </Pressable>
                </View>

                <TextInput
                  style={styles.inputObs}
                  placeholder="Observações (ex: tirar cebola, pouco sal...)"
                  placeholderTextColor="#999"
                  value={observacao}
                  onChangeText={setObservacao}
                  multiline
                />

                <Pressable style={styles.btnAdd} onPress={adicionarAoCarrinho}>
                  <Text style={styles.btnAddText}>Adicionar ao Carrinho</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  introContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  pergunta: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  opcoes: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16 },
  boxOpcao: {
    backgroundColor: "#171414",
    borderRadius: 16,
    padding: 15,
    margin: 5,
    width: 100,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e60000",
  },
  opcaoTexto: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  opcoesTopo: { flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingVertical: 15, paddingHorizontal: 8, marginTop: 25 },
  boxOpcaoTopo: { backgroundColor: "#171414", borderRadius: 16, paddingVertical: 10, paddingHorizontal: 12, minWidth: 70, alignItems: "center", borderWidth: 2, borderColor: "#e60000" },
  boxOpcaoAtiva: { backgroundColor: "#e60000" },
  opcaoTextoAtiva: { color: "#fff", fontWeight: "bold" },

  inputBusca: { backgroundColor: "#171414", color: "#fff", padding: 10, borderRadius: 8, marginHorizontal: 16, marginBottom: 10, borderWidth: 1, borderColor: "#e60000" },

  scroll: { paddingHorizontal: 16, paddingBottom: 140 },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#171414", borderRadius: 12, padding: 12, marginBottom: 12 },
  produtoImg: { width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: "#e60000" },
  produtoNome: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  produtoPreco: { marginTop: 4, fontSize: 14, fontWeight: "600", color: "#e60000" },

  sectionHeader: { fontSize: 18, fontWeight: "bold", color: "#e60000", marginVertical: 6, backgroundColor: "#111", paddingHorizontal: 8, borderRadius: 4 },

  indexContainer: { position: "absolute", right: 4, top: 80, bottom: 100, justifyContent: "center", alignItems: "center", padding: 4 },
  indexLetter: { color: "#e60000", fontWeight: "bold", fontSize: 12, marginVertical: 2 },

  btnCarrinho: { position: "absolute", bottom: 20, left: 16, right: 16, backgroundColor: "#e60000", paddingVertical: 12, borderRadius: 12, alignItems: "center" },
  btnCarrinhoText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "80%", backgroundColor: "#171414", borderRadius: 12, padding: 20, alignItems: "center" },
  modalTitulo: { fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 12 },
  letrasGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  letraBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: "#e60000", margin: 5, justifyContent: "center", alignItems: "center" },
  letraTexto: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  fecharBtn: { marginTop: 16, backgroundColor: "#444", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8 },
  fecharTexto: { color: "#fff", fontWeight: "bold" },

  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.95)", justifyContent: "center", alignItems: "center" },
  modalBox: { flex: 1, width: "100%", padding: 20, justifyContent: "center" },
  closeBtn: { position: "absolute", top: 40, right: 20, zIndex: 10, backgroundColor: "#e60000", padding: 8, borderRadius: 20 },
  closeText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalImg: { width: 200, height: 200, borderRadius: 8, marginBottom: 15 },
  modalNome: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  modalPreco: { fontSize: 18, color: "#e60000", marginBottom: 15 },

  qtdContainer: { flexDirection: "row", alignItems: "center", marginVertical: 15 },
  qtdBtn: { backgroundColor: "#e60000", padding: 5, borderRadius: 8, marginHorizontal: 10 },
  qtdBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  qtdText: { fontSize: 18, fontWeight: "bold", color: "#fff" },

  inputObs: { backgroundColor: "#171414", color: "#fff", padding: 10, borderRadius: 8, width: "100%", height: 60, marginBottom: 15, borderWidth: 1, borderColor: "#e60000" },

  btnAdd: { backgroundColor: "#e60000", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  btnAddText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  descricao: { color: "#ffffff9a" },
});
