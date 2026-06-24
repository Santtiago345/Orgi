"use client";
import { useQuery } from "@tanstack/react-query";
import { getAccounts } from "@/lib/api/accounts";
import { Wallet, Plus } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mis Cuentas</h2>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90">
          <Plus size={16} /> Nueva Cuenta
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-card p-6 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-32 mb-3" />
              <div className="h-8 bg-neutral-200 rounded w-40 mb-2" />
              <div className="h-3 bg-neutral-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts?.map((account) => (
            <div key={account.id} className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${account.color}20` }}>
                  <Wallet size={20} style={{ color: account.color }} />
                </div>
                <div>
                  <h3 className="font-medium">{account.name}</h3>
                  <p className="text-xs text-neutral-600">{account.bank_name || account.type}</p>
                </div>
              </div>
              <p className="text-2xl font-bold font-mono">{formatCOP(account.balance)}</p>
              <p className="text-xs text-neutral-600 mt-1">{account.currency}</p>
            </div>
          ))}
          {(!accounts || accounts.length === 0) && (
            <div className="col-span-2 text-center py-12 text-neutral-600">
              No hay cuentas registradas. Crea tu primera cuenta bancaria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
