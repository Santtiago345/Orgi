"use client";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/lib/api/accounts";
import { Plus, Building2, Wallet } from "lucide-react";
import { formatCOP } from "@/lib/utils";

export default function AccountsPage() {
  const { data: accounts, isLoading } = useQuery({ queryKey: ["accounts"], queryFn: getAccounts });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="page-title">Mis Cuentas</h2>
          <p className="page-subtitle">Gestiona tus cuentas bancarias y su saldo</p>
        </div>
        <button className="btn-primary"><Plus size={16} /> Nueva Cuenta</button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {[1, 2].map((i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-32 mb-4" />
              <div className="skeleton h-8 w-40 mb-2" />
              <div className="skeleton h-3 w-24" />
            </div>
          ))}
        </div>
      ) : accounts && accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account, idx) => (
            <div
              key={account.id}
              className="card-hover p-5 animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${account.color}15` }}>
                  <Wallet size={22} style={{ color: account.color }} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-900 truncate">{account.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Building2 size={12} /><span className="truncate">{account.bank_name || account.type}</span>
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold font-mono text-neutral-900">
                {formatCOP(account.balance || "0")}
              </p>
              <p className="text-xs text-neutral-400 mt-1">{account.currency === "COP" ? "Peso Colombiano (COP)" : account.currency}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card animate-fade-in">
          <div className="empty-state">
            <div className="empty-state-icon"><Wallet size={24} className="text-primary/40" /></div>
            <p className="font-semibold text-neutral-600">No hay cuentas registradas</p>
            <p className="text-sm text-neutral-400 mt-1">Crea tu primera cuenta bancaria para empezar.</p>
          </div>
        </div>
      )}
    </div>
  );
}
