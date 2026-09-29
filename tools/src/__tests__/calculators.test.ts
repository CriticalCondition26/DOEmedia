import { describe, expect, it } from "vitest";
import vectors from "./test-vectors.json";
import { calculate } from "../calculator-engine";

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
