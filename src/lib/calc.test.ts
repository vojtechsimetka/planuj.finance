import { describe, test, expect } from 'vitest'
import { getEffectiveInterestRate } from './calc'
import Decimal from 'decimal.js'

describe('getEffectiveInterestRate', () => {
	test('should return 0 for all values equal to 0', () => {
		const res = getEffectiveInterestRate(
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
		)
		expect(res.effectiveInterestRate.toNumber()).toBe(0)
	})

	test('should return -2% for inflation equal to 2%', () => {
		const res = getEffectiveInterestRate(
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
			new Decimal(2),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeCloseTo(-0.02)
	})

	test('should handle 100% success fee (no earnings)', () => {
		const res = getEffectiveInterestRate(
			new Decimal(10),
			new Decimal(100),
			new Decimal(0),
			new Decimal(0),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeCloseTo(0, 2)
	})

	test('should handle 100% management fee (no earnings)', () => {
		const res = getEffectiveInterestRate(
			new Decimal(10),
			new Decimal(0),
			new Decimal(100),
			new Decimal(0),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeCloseTo(-1, 2)
	})

	test('should handle 100% inflation (no real value)', () => {
		const res = getEffectiveInterestRate(
			new Decimal(10),
			new Decimal(0),
			new Decimal(0),
			new Decimal(100),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeCloseTo(-1, 2)
	})

	test('should return negative when inflation is higher than interest rate', () => {
		const res = getEffectiveInterestRate(
			new Decimal(5),
			new Decimal(0),
			new Decimal(0),
			new Decimal(10),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeLessThan(0)
	})

	test('should handle negative interest rate', () => {
		const res = getEffectiveInterestRate(
			new Decimal(-5),
			new Decimal(0),
			new Decimal(0),
			new Decimal(0),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeCloseTo(-0.05)
	})

	test('should handle negative inflation', () => {
		const res = getEffectiveInterestRate(
			new Decimal(10),
			new Decimal(0),
			new Decimal(0),
			new Decimal(-2),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeGreaterThan(0)
	})

	test('should handle large values', () => {
		const res = getEffectiveInterestRate(
			new Decimal(100),
			new Decimal(50),
			new Decimal(50),
			new Decimal(50),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeCloseTo(-0.625, 3)
	})

	test('edge case with all parameters at their extremes', () => {
		const res = getEffectiveInterestRate(
			new Decimal(100),
			new Decimal(100),
			new Decimal(100),
			new Decimal(100),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeCloseTo(-1, 2)
	})

	test('should handle zero interest rate with fees and inflation', () => {
		const res = getEffectiveInterestRate(
			new Decimal(0),
			new Decimal(10),
			new Decimal(10),
			new Decimal(10),
		)
		expect(res.effectiveInterestRate.toNumber()).toBeLessThan(0)
	})
})
