import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import KPICard from "../components/dashboard/KPICard";

describe("KPICard", () => {
  it("renders title and value", () => {
    render(<KPICard title="Patrimonio Neto" value="10000000" icon={TrendingUp} color="#1A56DB" />);
    expect(screen.getByText("Patrimonio Neto")).toBeDefined();
    expect(screen.getByText(/\$ 10\.000\.000/)).toBeDefined();
  });

  it("shows skeleton when loading", () => {
    const { container } = render(<KPICard title="Test" value="0" icon={TrendingUp} color="#000" loading />);
    expect(container.querySelector(".animate-pulse")).toBeDefined();
  });

  it("shows upward trend for positive change", () => {
    render(<KPICard title="Ingresos" value="5000000" change={12} changeType="up" icon={TrendingUp} color="#0EA472" />);
    expect(screen.getByText(/12\.0% vs mes anterior/)).toBeDefined();
  });

  it("shows downward trend for negative change", () => {
    render(<KPICard title="Gastos" value="3000000" change={5} changeType="down" icon={TrendingDown} color="#E02424" />);
    expect(screen.getByText(/5\.0% vs mes anterior/)).toBeDefined();
  });
});
