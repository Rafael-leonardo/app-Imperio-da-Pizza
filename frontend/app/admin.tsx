import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert } from "react-native";
import { Stack } from "expo-router";
import axios from "axios";

export default function Admin() {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [descricao, setDescricao] = useState("");
  const [img, setImg] = useState("");
  const [categoria, setCategoria] = useState<"Promocoes" | "Pizza" | "Esfihas" | "Bebidas">("Pizza");
  const [loading, setLoading] = useState(false);

  const categorias = ["Promocoes", "Pizza", "Esfihas", "Bebidas"];

  const handleAdicionarProduto = async () => {
    if (!nome || !preco || !categoria || !img) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://192.168.15.11:3000/", {
        nome,
        preco,
        descricao,
        img,
        categoria,
      });
      Alert.alert("Sucesso", "Produto adicionado com sucesso!");
      setNome("");
      setPreco("");
      setDescricao("");
      setImg("");
      setCategoria("Pizza");
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível adicionar o produto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Admin", headerStyle: { backgroundColor: "#000" }, headerTintColor: "#fff" }} />
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Nome do Produto"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="Preço (R$ 00,00)"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={preco}
          onChangeText={setPreco}
        />
        <TextInput
          placeholder="Descrição"
          placeholderTextColor="#ccc"
          style={[styles.input, { height: 100 }]}
          value={descricao}
          multiline
          onChangeText={setDescricao}
        />
        <TextInput
          placeholder="Imagem (URL)"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={img}
          onChangeText={setImg}
        />
        

        <View style={styles.categoriasContainer}>
          {categorias.map((cat) => (
            <Pressable
              key={cat}
              style={[styles.categoriaBtn, categoria === cat && styles.categoriaSelected]}
              onPress={() => setCategoria(cat as any)}
            >
              <Text style={styles.categoriaText}>{cat}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.btnAdicionar} onPress={handleAdicionarProduto} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "Adicionando..." : "Adicionar Produto"}</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#000",
    alignItems: "center",
  },
  input: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#171414",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15,
  },
  categoriasContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  categoriaBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#111",
    borderRadius: 10,
    margin: 5,
  },
  categoriaSelected: {
    backgroundColor: "#e60000",
  },
  categoriaText: {
    color: "#fff",
    fontWeight: "bold",
  },
  btnAdicionar: {
    backgroundColor: "#e60000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
