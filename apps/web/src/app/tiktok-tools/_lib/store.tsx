"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Client, ClientDefaults, Product, ProductAssumptions, Store } from "./types";
import { makeClient, makeProduct } from "./defaults";

const STORAGE_KEY = "doe.tiktok-tools.v1";

type StoreContextValue = {
  ready: boolean;
  clients: Client[];
  lastSavedAt: number | null;
  getClient: (id: string) => Client | undefined;
  createClient: () => Client;
  deleteClient: (id: string) => void;
  updateClient: (id: string, patch: Partial<Pick<Client, "name" | "vertical">>) => void;
  updateClientDefaults: (id: string, patch: Partial<ClientDefaults>) => void;
  createProduct: (clientId: string) => Product;
  deleteProduct: (clientId: string, productId: string) => void;
  duplicateProduct: (clientId: string, productId: string) => Product | undefined;
  updateProduct: (
    clientId: string,
    productId: string,
    patch: Partial<Pick<Product, "name" | "included">>
  ) => void;
  updateProductAssumptions: (
    clientId: string,
    productId: string,
    patch: Partial<ProductAssumptions>
  ) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function loadStore(): Store {
  if (typeof window === "undefined") return { clients: [], selectedClientId: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { clients: [], selectedClientId: null };
    const parsed = JSON.parse(raw) as Store;
    return parsed;
  } catch {
    return { clients: [], selectedClientId: null };
  }
}

function saveStore(store: Store) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  useEffect(() => {
    const initial = loadStore();
    setClients(initial.clients);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveStore({ clients, selectedClientId: null });
    setLastSavedAt(Date.now());
  }, [clients, ready]);

  const mutate = useCallback((fn: (current: Client[]) => Client[]) => {
    setClients((current) => fn(current));
  }, []);

  const value: StoreContextValue = useMemo(() => {
    const updateClientShape = (id: string, fn: (c: Client) => Client) => {
      mutate((current) =>
        current.map((c) => (c.id === id ? { ...fn(c), updatedAt: Date.now() } : c))
      );
    };

    return {
      ready,
      clients,
      lastSavedAt,
      getClient: (id) => clients.find((c) => c.id === id),
      createClient: () => {
        const client = makeClient();
        mutate((current) => [...current, client]);
        return client;
      },
      deleteClient: (id) => mutate((current) => current.filter((c) => c.id !== id)),
      updateClient: (id, patch) => updateClientShape(id, (c) => ({ ...c, ...patch })),
      updateClientDefaults: (id, patch) =>
        updateClientShape(id, (c) => ({ ...c, defaults: { ...c.defaults, ...patch } })),
      createProduct: (clientId) => {
        const product = makeProduct();
        updateClientShape(clientId, (c) => ({ ...c, products: [...c.products, product] }));
        return product;
      },
      deleteProduct: (clientId, productId) =>
        updateClientShape(clientId, (c) => ({
          ...c,
          products: c.products.filter((p) => p.id !== productId),
        })),
      duplicateProduct: (clientId, productId) => {
        const client = clients.find((c) => c.id === clientId);
        const original = client?.products.find((p) => p.id === productId);
        if (!original) return undefined;
        const copy: Product = {
          ...original,
          id: makeProduct().id,
          name: `${original.name} (copy)`,
          assumptions: {
            ...original.assumptions,
            overrides: { ...original.assumptions.overrides },
          },
          updatedAt: Date.now(),
        };
        updateClientShape(clientId, (c) => ({ ...c, products: [...c.products, copy] }));
        return copy;
      },
      updateProduct: (clientId, productId, patch) =>
        updateClientShape(clientId, (c) => ({
          ...c,
          products: c.products.map((p) =>
            p.id === productId ? { ...p, ...patch, updatedAt: Date.now() } : p
          ),
        })),
      updateProductAssumptions: (clientId, productId, patch) =>
        updateClientShape(clientId, (c) => ({
          ...c,
          products: c.products.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  assumptions: {
                    ...p.assumptions,
                    ...patch,
                    overrides: { ...p.assumptions.overrides, ...(patch.overrides ?? {}) },
                  },
                  updatedAt: Date.now(),
                }
              : p
          ),
        })),
    };
  }, [clients, lastSavedAt, ready, mutate]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
