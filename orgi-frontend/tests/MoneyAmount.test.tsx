import { describe, it, expect } from "vitest";

function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

describe("MoneyAmount formatting", () => {
  it("formats positive amount in COP", () => {
    const result = formatCOP(45000);
    expect(result).toContain("45.000");
  });

  it("formats large amounts with dots", () => {
    const result = formatCOP(3500000);
    expect(result).toContain("3.500.000");
  });

  it("formats zero", () => {
    const result = formatCOP(0);
    expect(result).toContain("0");
  });
});
