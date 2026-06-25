"use client";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/lib/api/accounts";
import { Wallet, Plus, Building2 } from "lucide-react";

export default function AccountsPage() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });

  const formatCOP = (amount: string) => {
    try {
      const num = parseFloat(amount);
      return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(num);
    } catch { return amount; }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Mis Cuentas</h2>
          <p className="text-sm text-neutral-500 mt-0.5">Gestiona tus cuentas bancarias y su saldo</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Nueva Cuenta
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-neutral-100 rounded w-32 mb-3" />
              <div className="h-8 bg-neutral-100 rounded w-40 mb-2" />
              <div className="h-3 bg-neutral-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div key={account.id} className="card-hover p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${account.color}15` }}>
                  <Wallet size={22} style={{ color: account.color }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-800 truncate">{account.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Building2 size={12} />
                    <span className="truncate">{account.bank_name || account.type}</span>
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold font-mono text-neutral-800">{formatCOP(account.balance)}</p>
              <p className="text-xs text-neutral-400 mt-1">
                {account.currency === "COP" ? "Peso Colombiano" : account.currency}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">
              <Wallet size={24} className="text-neutral-400" />
            </div>
            <p className="font-semibold text-neutral-700">No hay cuentas registradas</p>
            <p className="text-sm text-neutral-500 mt-1">Crea tu primera cuenta bancaria para empezar.</p>
          </div>
        </div>
      )}
    </div>
  );
}
