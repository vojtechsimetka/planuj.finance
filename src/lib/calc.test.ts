import { describe, test, expect } from 'vitest'
import { getEffectiveInterestRate, calculateTotal } from './calc'
import type { Deposit, Withdrawal } from './types'
import { withDetailsStore } from './stores/details.svelte'
import { day, week, month, year } from './utils'

describe('getEffectiveInterestRate', () => {
	test('should return 0 for all values equal to 0', () => {
		const res = getEffectiveInterestRate(0, 0, 0, 0)
		expect(res).toBe(0)
	})

	test('should return -2% for inflation equal to 2%', () => {
		const res = getEffectiveInterestRate(0, 0, 0, 2)
		expect(res).toBeCloseTo(-0.02)
	})

	test('should handle 100% success fee (no earnings)', () => {
		const res = getEffectiveInterestRate(10, 100, 0, 0)
		expect(res).toBeCloseTo(0, 2)
	})

	test('should handle 100% management fee (no earnings)', () => {
		const res = getEffectiveInterestRate(10, 0, 100, 0)
		expect(res).toBeCloseTo(-1, 2)
	})

	test('should handle 100% inflation (no real value)', () => {
		const res = getEffectiveInterestRate(10, 0, 0, 100)
		expect(res).toBeCloseTo(-1, 2)
	})

	test('should return negative when inflation is higher than interest rate', () => {
		const res = getEffectiveInterestRate(5, 0, 0, 10)
		expect(res).toBeLessThan(0)
	})

	test('should handle negative interest rate', () => {
		const res = getEffectiveInterestRate(-5, 0, 0, 0)
		expect(res).toBeCloseTo(-0.05)
	})

	test('should handle negative inflation', () => {
		const res = getEffectiveInterestRate(10, 0, 0, -2)
		expect(res).toBeGreaterThan(0)
	})

	test('should handle large values', () => {
		const res = getEffectiveInterestRate(100, 50, 50, 50)
		expect(res).toBeCloseTo(-0.625, 3)
	})

	test('edge case with all parameters at their extremes', () => {
		const res = getEffectiveInterestRate(100, 100, 100, 100)
		expect(res).toBeCloseTo(-1, 2)
	})

	test('should handle zero interest rate with fees and inflation', () => {
		const res = getEffectiveInterestRate(0, 10, 10, 10)
		expect(res).toBeLessThan(0)
	})
})

describe('calculateTotal', () => {
	test('should return 0 for empty array', () => {
		const res = calculateTotal([])
		expect(res).toBe(0)
	})

	// TODO: add more tests
	/*
		bez opakovani deposity/withdrawal
		s jednim opakovanimi - pro den, tyden, mesic, rok
		s vice opakovanimi - pro den, tyden, mesic, rok
		pro vice depositu/withdrawalu s ruznymi opakovanimi
		pro vice deposity/withdrawalu s ruznymi opakovanimi i bez opakovani
		pro zaporne hodnoty
		pro nulove hodnoty
	*/
	test('should calculate total for a single non-recurring deposit', () => {
		const detailStore = withDetailsStore()
		const deposit: Deposit = {
			name: 'test',
			amount: 100,
			startDate: new Date(2020, 1, 1),
			isRecurring: false,
		}
		detailStore.addDeposit(deposit)
		const res = calculateTotal(detailStore.deposits)
		expect(res).toBe(100)
	})

	test('should calculate total for a single recurring deposit (daily)', () => {
		const detailStore = withDetailsStore()
		const deposit: Deposit = {
			name: 'test',
			amount: 100,
			isRecurring: true,
			startDate: new Date(2020, 1, 1),
			frequency: day,
			endDate: new Date(2020, 1, 2),
		}
		detailStore.addDeposit(deposit)
		const res = calculateTotal(detailStore.deposits)
		expect(res).toBe(200)
	})
	test('should calculate total for a single recurring deposit (weekly)', () => {
		const detailStore = withDetailsStore()
		const deposit: Deposit = {
			name: 'test',
			amount: 100,
			isRecurring: true,
			startDate: new Date(2020, 1, 1),
			frequency: week,
			endDate: new Date(2020, 1, 8),
		}
		detailStore.addDeposit(deposit)
		const res = calculateTotal(detailStore.deposits)
		expect(res).toBe(200)
	})
	test('should calculate total for a single recurring deposit (monthly)', () => {
		const detailStore = withDetailsStore()
		const deposit: Deposit = {
			name: 'test',
			amount: 100,
			isRecurring: true,
			startDate: new Date(2020, 1, 1),
			frequency: week,
			endDate: new Date(2020, 2, 2),
		}
		detailStore.addDeposit(deposit)
		const res = calculateTotal(detailStore.deposits)
		expect(res).toBe(200)
	})
	test('should calculate total for a single recurring deposit (yearly)', () => {
		const detailStore = withDetailsStore()
		const deposit: Deposit = {
			name: 'test',
			amount: 100,
			isRecurring: true,
			startDate: new Date(2020, 1, 1),
			frequency: year,
			endDate: new Date(2021, 2, 2),
		}
		detailStore.addDeposit(deposit)
		const res = calculateTotal(detailStore.deposits)
		expect(res).toBe(200)
	})

	test('should calculate total for multiple non-recurring deposits', () => {
		const detailStore = withDetailsStore()
		const deposits: Deposit[] = [
			{ name: 'test', amount: 100, startDate: new Date(), isRecurring: false },
			{ name: 'test', amount: 200, startDate: new Date(), isRecurring: false },
			{ name: 'test', amount: 300, startDate: new Date(), isRecurring: false },
		]
		deposits.forEach((deposit) => detailStore.addDeposit(deposit))
		const res = calculateTotal(detailStore.deposits)
		expect(res).toBe(600)
	})
})
