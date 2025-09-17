import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import api from "../services/api";

export default function NotaFiscal() {
  const router = useRouter();
  const { pedidoId } = useLocalSearchParams();
  const [nota, setNota] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNota = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/pedidos/${pedidoId}/nota`);
        setNota(response.data.nota);
      } catch (err: any) {
        setError("Erro ao gerar nota fiscal.");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (pedidoId) fetchNota();
  }, [pedidoId]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Nota Fiscal",
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
        }}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#e60000" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <ScrollView style={styles.scroll}>
            <Text style={styles.nota}>{nota}</Text>
          </ScrollView>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  scroll: { flex: 1 },
  nota: { color: "#fff", fontFamily: "monospace", fontSize: 14 },
  error: { color: "red", textAlign: "center", marginTop: 50 },
});
