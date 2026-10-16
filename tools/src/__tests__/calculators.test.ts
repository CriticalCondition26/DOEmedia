import { describe, expect, it } from "vitest";
import vectors from "./test-vectors.json";
import { calculate } from "../calculator-engine";
import { calculators } from "../calculator-definitions";

type Vector = {
  mode: string | null;
  inputs: Record<string, string | number>;
  expected: Record<string, string>;
};

describe("calculator reference vectors", () => {
  let cases = 0;

  for (const tool of vectors.tools) {
    for (const vector of tool.vectors as Vector[]) {
      cases += 1;

      it(`${tool.tool_id} vector ${cases}`, () => {
        const result = calculate(tool.tool_id, vector.mode, vector.inputs);

        for (const [key, expected] of Object.entries(vector.expected)) {
          expect(result[key], key).toBe(expected === "—" ? "n/a" : expected);
        }
      });
    }
  }

  it("contains all 115 supplied vectors", () => {
    expect(cases).toBe(115);
  });
});

describe("visible scenario controls", () => {
  it("uses campaign length for daily ad budget", () => {
    const result = calculate("ad-budget-calculator", null, {
      revenueGoal: 50000,
      aov: 80,
      cvrPct: 3,
      cpc: 1.87,
      flightDays: 60,
    });
    expect(result["text:daily"]).toBe("$649");
  });

  it("uses the visible exploration target in ROAS scenarios", () => {
    const result = calculate("roas-calculator", "roas", {
      revenue: 25000,
      spend: 10000,
      exploreTargetRoas: 4,
    });
    expect(result["Revenue at target"]).toBe("$40,000");
    expect(result["Revenue gap to target"]).toBe("$15,000");
  });

  it("uses achieved ROAS for break-even scenario rows", () => {
    const result = calculate("breakeven-roas-calculator", null, {
      aov: 80,
      cogs: 22,
      shipping: 8,
      processingRatePct: 2.9,
      processingFixed: 0.3,
      otherVariable: 2,
      achievedRoas: 4,
    });
    expect(result["Profit per order"]).toBe("$25.38");
    expect(result["Ad spend per order"]).toBe("$20.00");
    expect(result["Net margin"]).toBe("31.7%");
  });

  it("uses scenario spend for estimated CPC clicks", () => {
    const result = calculate("cpc-calculator", "spend", {
      spend: 2400,
      clicks: 1284,
      exploreSpend: 200,
    });
    expect(result["text:clicks"]).toBe("107");
  });

  it("uses visible AOV increase for scenario revenue", () => {
    const result = calculate("aov-calculator", null, {
      revenue: 48600,
      orders: 610,
      aovIncrease: 20,
    });
    expect(result["Additional revenue"]).toBe("$12,200");
    expect(result["Scenario revenue"]).toBe("$60,800");
  });

  it("uses inspection month for CAC payback progress", () => {
    const result = calculate("cac-payback-calculator", null, {
      cac: 60,
      aov: 80,
      marginRatePct: 55,
      ordersPerMonth: 0.2,
      inspectMonth: 10,
    });
    expect(result["Contribution by this month"]).toBe("$88.00");
    expect(result["CAC still unrecovered"]).toBe("$0.00");
  });

  it("states the fixed A/B decision threshold and test method", () => {
    const result = calculate("ab-test-significance-calculator", null, {
      visitorsA: 4800,
      conversionsA: 144,
      visitorsB: 4800,
      conversionsB: 180,
    });
    expect(result["Decision threshold"]).toBe("p < 0.05");
    expect(result.Test).toBe("Two-proportion z-test");
  });
});

describe("calculator explanation copy", () => {
  it("provides distinct guidance and an explicit formula for every tool", () => {
    expect(calculators).toHaveLength(27);
    for (const tool of calculators) {
      expect(tool.guidance).not.toBe(tool.tells);
      expect(tool.guidance.length).toBeGreaterThan(30);
      expect(tool.formula.length).toBeGreaterThan(10);
      expect(`${tool.guidance} ${tool.calculation} ${tool.formula}`).not.toMatch(
        /[—–]|!|synergy|holistic|innovative|cutting-edge/i,
      );
    }
  });

  it("declares every control needed by a rendered scenario", () => {
    const required: Record<string, string> = {
      "ad-budget-calculator": "flightDays",
      "roas-calculator": "exploreTargetRoas",
      "breakeven-roas-calculator": "achievedRoas",
      "cpc-calculator": "exploreSpend",
      "aov-calculator": "aovIncrease",
      "cac-payback-calculator": "inspectMonth",
    };
    for (const [toolId, fieldKey] of Object.entries(required)) {
      const tool = calculators.find((candidate) => candidate.id === toolId);
      expect(tool?.fields.some((field) => field.key === fieldKey)).toBe(true);
    }
  });
});
