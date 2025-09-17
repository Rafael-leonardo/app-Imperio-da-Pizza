import React from "react";
import { View, Text, Pressable, StyleSheet, ImageBackground } from "react-native";
import { useRouter, Stack } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ImageBackground
        source={require("../assets/images/fachada.png")} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.bottomSection}>
            <Text style={styles.subtitle}>Toque para iniciar seu pedido</Text>
            <Pressable style={styles.button} onPress={() => router.push("/info")}>
              <Text style={styles.buttonText}>Iniciar Pedido</Text>
            </Pressable>
          </View>
        </View>
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
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D32F2F",
    marginTop: 80,
    textAlign: "center",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#D32F2F",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
