"use client";
import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(email, password, name);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al crear la cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-modal p-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-neutral-800">Crear Cuenta</h2>
        <p className="text-sm text-neutral-500 mt-1">Regístrate para gestionar tus finanzas</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 bg-danger-light text-danger text-sm p-3.5 rounded-xl mb-6 border border-danger/10 animate-fade-in">
          <div className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nombre completo</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="input-field pl-10" placeholder="Tu nombre" required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Correo electrónico</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10" placeholder="tu@email.com" required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1.5">Contraseña</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type={showPassword ? "text" : "password"} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pl-10 pr-10" placeholder="Mínimo 6 caracteres" minLength={6} required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-neutral-400 mt-1.5">Debe tener al menos 6 caracteres</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><UserPlus size={16} /> Crear Cuenta</>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-8">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary font-semibold hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
