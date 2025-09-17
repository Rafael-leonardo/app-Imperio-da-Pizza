import React, { createContext, useContext, useState, ReactNode } from "react";

interface Produto {
  id: number;
  nome: string;
  preco: string;
  img: string;
  categoria: string;
}

interface CarrinhoItem {
  produto: Produto;
  qtd: number;
  observacao: string;
}

interface CarrinhoContextType {
  carrinho: CarrinhoItem[];
  setCarrinho: React.Dispatch<React.SetStateAction<CarrinhoItem[]>>;
  adicionarAoCarrinho: (produto: Produto, qtd?: number, observacao?: string) => void;
  removerDoCarrinho: (produtoId: number) => void;
  atualizarQtd: (produtoId: number, qtd: number) => void;
  limparCarrinho: () => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);

  const adicionarAoCarrinho = (produto: Produto, qtd: number = 1, observacao: string = "") => {
    setCarrinho((prev) => {
      const existente = prev.find((item) => item.produto.id === produto.id);

      if (existente) {
        return prev.map((item) =>
          item.produto.id === produto.id
            ? { ...item, qtd: item.qtd + qtd, observacao: observacao || item.observacao }
            : item
        );
      }

      return [...prev, { produto, qtd, observacao }];
    });
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho((prev) => prev.filter((item) => item.produto.id !== produtoId));
  };

  const atualizarQtd = (produtoId: number, qtd: number) => {
    setCarrinho((prev) =>
      prev.map((item) =>
        item.produto.id === produtoId ? { ...item, qtd } : item
      )
    );
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQtd,
        limparCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  }
  return context;
};
