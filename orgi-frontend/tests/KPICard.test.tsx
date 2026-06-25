import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KPICard from "../components/dashboard/KPICard";

describe("KPICard", () => {
  it("renders title and value", () => {
    render(<KPICard title="Patrimonio Neto" value="$ 10.000.000" icon={<span>🏦</span>} />);
    expect(screen.getByText("Patrimonio Neto")).toBeDefined();
    expect(screen.getByText(/\$ 10\.000\.000/)).toBeDefined();
  });

  it("shows upward trend", () => {
    render(<KPICard title="Ingresos" value="$ 5.000.000" icon={<span>📈</span>} trend="up" trendValue="12.0%" />);
    expect(screen.getByText(/12\.0%/)).toBeDefined();
  });

  it("shows downward trend", () => {
    render(<KPICard title="Gastos" value="$ 3.000.000" icon={<span>📉</span>} trend="down" trendValue="5.0%" />);
    expect(screen.getByText(/5\.0%/)).toBeDefined();
  });
});
