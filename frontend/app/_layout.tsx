import { Stack } from "expo-router";
import React from "react";
import { CarrinhoProvider } from "../contexts/carrinhoContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CarrinhoProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {children}
      </Stack>
    </CarrinhoProvider>
  );
}
