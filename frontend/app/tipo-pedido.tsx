import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

export default function TipoPedido() {
  const router = useRouter();
  const { nome, telefone } = useLocalSearchParams();
  const [tipo, setTipo] = useState<"retirada" | "entrega" | null>(null);
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarEndereco = async (valorCep: string) => {
    if (valorCep.length !== 8) return;
    try {
      setLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${valorCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      setRua(data.logradouro || "");
      setBairro(data.bairro || "");
    } catch (err) {
      alert("Erro ao buscar CEP!");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (
      tipo === "entrega" &&
      (cep.trim() === "" ||
        rua.trim() === "" ||
        numero.trim() === "" ||
        bairro.trim() === "")
    ) {
      alert("Por favor, informe o endereço!");
      return;
    }
    router.push({
      pathname: "/menu",
      params: { nome, telefone, tipo, cep, rua, numero, bairro },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../assets/images/tipo-pedido.png")}
        style={styles.background}
        resizeMode="contain"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.buttonsContainer}>
                  <Pressable
                    style={[
                      styles.button,
                      tipo === "retirada" && styles.buttonSelected,
                    ]}
                    onPress={() => setTipo("retirada")}
                  >
                    <Text style={styles.buttonText}>Retirada</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.button,
                      tipo === "entrega" && styles.buttonSelected,
                    ]}
                    onPress={() => setTipo("entrega")}
                  >
                    <Text style={styles.buttonText}>Entrega</Text>
                  </Pressable>
                </View>

                {tipo === "entrega" && (
                  <>
                    <TextInput
                      placeholder="Digite seu CEP"
                      placeholderTextColor="#ccc"
                      style={styles.input}
                      value={cep}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        const onlyNumbers = text.replace(/\D/g, "");
                        setCep(onlyNumbers);
                        if (onlyNumbers.length === 8) {
                          buscarEndereco(onlyNumbers);
                        }
                      }}
                    />

                    {loading && <ActivityIndicator size="small" color="#fff" />}

                    <TextInput
                      placeholder="Rua"
                      placeholderTextColor="#ccc"
                      style={styles.input}
                      value={rua}
                      onChangeText={setRua}
                    />
                    <TextInput
                      placeholder="Número"
                      placeholderTextColor="#ccc"
                      style={styles.input}
                      value={numero}
                      onChangeText={setNumero}
                    />
                    <TextInput
                      placeholder="Bairro"
                      placeholderTextColor="#ccc"
                      style={styles.input}
                      value={bairro}
                      onChangeText={setBairro}
                    />
                  </>
                )}

                <Pressable style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.buttonText}>Próximo</Text>
                </Pressable>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#6c0000",
    alignSelf: "center",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    width: "100%",
    maxWidth: 400,
  },
  button: {
    backgroundColor: "#111",
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonSelected: { backgroundColor: "#D32F2F" },
  buttonText: {
    color: "#fff",
    fontSize: width < 360 ? 16 : 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    marginTop: 20,
    width: "100%",
    maxWidth: 400,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#111",
    color: "#fff",
  },
  nextButton: {
    marginTop: 30,
    backgroundColor: "#D32F2F",
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
  },
});
