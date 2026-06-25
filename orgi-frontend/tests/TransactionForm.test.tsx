import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/api/accounts", () => ({
  getAccounts: vi.fn().mockResolvedValue([
    { id: 1, name: "Cuenta Corriente", bank_name: "Banco", balance: "500000", currency: "COP", type: "corriente", color: "#000", is_active: true, user_id: 1, created_at: "2026-01-01" },
  ]),
}));

vi.mock("@/lib/api/categories", () => ({
  getCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Alimentación", type: "gasto", color: "#f00", icon: null, is_system: true, user_id: 1, parent_id: null, created_at: "2026-01-01" },
    { id: 2, name: "Salario", type: "ingreso", color: "#0f0", icon: null, is_system: true, user_id: 1, parent_id: null, created_at: "2026-01-01" },
  ]),
}));

vi.mock("@/lib/api/transactions", () => ({
  createTransaction: vi.fn().mockResolvedValue({ id: 1 }),
  updateTransaction: vi.fn().mockResolvedValue({ id: 1 }),
}));

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

import TransactionForm from "../components/transactions/TransactionForm";

describe("TransactionForm", () => {
  const onSuccess = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the form title in create mode", () => {
    renderWithProviders(<TransactionForm onSuccess={onSuccess} onClose={onClose} />);
    expect(screen.getByText("Nueva Transacción")).toBeDefined();
  });

  it("renders the form title in edit mode", () => {
    renderWithProviders(<TransactionForm transaction={{
      id: 1, user_id: 1, account_id: 1, category_id: 1, fecha: "2026-06-24T00:00:00Z",
      tipo: "gasto", cantidad: "50000", descripcion: "Test", is_reconciled: false,
      created_at: "2026-06-24T00:00:00Z",
    }} onSuccess={onSuccess} onClose={onClose} />);
    expect(screen.getByText("Editar Transacción")).toBeDefined();
  });

  it("shows three type buttons", () => {
    renderWithProviders(<TransactionForm onSuccess={onSuccess} onClose={onClose} />);
    expect(screen.getAllByText("Gasto").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Ingreso")).toBeDefined();
    expect(screen.getByText("Transferencia")).toBeDefined();
  });

  it("renders cancel and submit buttons", () => {
    renderWithProviders(<TransactionForm onSuccess={onSuccess} onClose={onClose} />);
    expect(screen.getAllByText("Cancelar").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Guardar")).toBeDefined();
  });
});
