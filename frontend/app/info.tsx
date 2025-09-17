import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView
} from "react-native";
import { Stack, useRouter } from "expo-router";

export default function Info() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleNext = () => {
    if (!nome.trim() || !telefone.trim()) {
      alert("Por favor, preencha nome e telefone!");
      return;
    }
    router.push({ pathname: "/tipo-pedido", params: { nome, telefone } });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../assets/images/fachada.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                contentContainerStyle={styles.overlay}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.inputsContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#ccc"
                    value={nome}
                    onChangeText={setNome}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    placeholderTextColor="#ccc"
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.bottomSection}>
                  <Pressable style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.buttonText}>Próximo</Text>
                  </Pressable>
                </View>
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
  },
  overlay: {
    flexGrow: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    padding: 20,
    justifyContent: "flex-end",
  },
  inputsContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    width: "90%", 
    maxWidth: 400,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#111",
    color: "#fff",
    marginBottom: 15,
  },
  bottomSection: {
    width: "100%",
    alignItems: "center",
    marginBottom: 60,
  },
  nextButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
