import { formatNumber, toNumber } from "./number";

describe("number utils", () => {
  describe("formatNumber", () => {
    it("returns empty string for null", () => {
      expect(formatNumber(null)).toBe("");
    });

    it("returns empty string for NaN", () => {
      expect(formatNumber(NaN)).toBe("");
    });

    it("formats number", () => {
      const result = formatNumber(10);
      expect(typeof result).toBe("string");
      expect(result).toContain("10");
    });

    it("formats decimal number", () => {
      const result = formatNumber(10.5);
      expect(typeof result).toBe("string");
      expect(result).toContain("10");
    });

    it("formats large number", () => {
      const result = formatNumber(10000);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("formats fraction digits", () => {
      const result = formatNumber(10.555, 2);
      expect(typeof result).toBe("string");
      expect(result).toMatch(/10/);
    });
  });

  describe("toNumber", () => {
    it("returns null for null/undefined", () => {
      expect(toNumber(null)).toBeNull();
      expect(toNumber(undefined)).toBeNull();
    });

    it("returns number if number", () => {
      expect(toNumber(5)).toBe(5);
    });

    it("converts dot string", () => {
      expect(toNumber("10.5")).toBe(10.5);
    });

    it("converts comma string", () => {
      expect(toNumber("10,5")).toBe(10.5);
    });

    it("returns NaN for invalid string", () => {
      expect(isNaN(toNumber("abc"))).toBe(true);
    });
  });
});
