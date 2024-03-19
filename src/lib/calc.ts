import Decimal from 'decimal.js'
import type { Deposit, Withdrawal, Frequency } from './types'
import { formatDate } from './utils'

Decimal.set({ precision: 30 })

const c1 = new Decimal(1)
const c100 = new Decimal(100)

export function getEffectiveInterestRate(
	interest: Decimal,
	successFee: Decimal,
	managementFee: Decimal,
	inflation: Decimal,
) {
	const interestRate = interest.div(c100)
	const inflationRate = c1.sub(inflation.div(c100))
	const successFeeRate = c1.sub(successFee.div(c100))

	const successFeePercentage = interestRate.sub(interestRate.mul(successFeeRate)).mul(inflationRate)
	const managementFeeRate = c1.sub(managementFee.div(c100))
	const effectiveInterestRate = c1
		.add(interestRate.mul(successFeeRate))
		.mul(managementFeeRate)
		.mul(inflationRate)
		.sub(c1)
	const managementFeePercentage = effectiveInterestRate
		.sub(c1.add(interestRate.mul(successFeeRate)).sub(c1))
		.mul(inflationRate)
		.abs()

	return {
		effectiveInterestRate,
		successFeePercentage: successFeePercentage.greaterThanOrEqualTo(0)
			? successFeePercentage
			: new Decimal(0),
		managementFeePercentage,
	}
}

export function splitWithRation(
	ratio1: Decimal,
	ratio2: Decimal,
	value: Decimal,
): [Decimal, Decimal] {
	if (ratio1.equals(0) && ratio2.equals(0)) {
		return [new Decimal(0), new Decimal(0)]
	}

	const totalPercentage = ratio1.add(ratio2)

	// If one percentage is 0, assign the entire value to the other portion
	if (ratio1.equals(0)) {
		return [new Decimal(0), value]
	} else if (ratio2.equals(0)) {
		return [value, new Decimal(0)]
	}

	// Calculate portions
	const portion1 = ratio1.div(totalPercentage).mul(value)
	const portion2 = ratio2.div(totalPercentage).mul(value)

	return [portion1, portion2]
}

export function incrementDate(date: Date, frequency: Frequency, count = 1) {
	const d = new Date(date.getTime())
	switch (frequency) {
		case 'day':
			d.setDate(date.getDate() + count)
			break
		case 'week':
			d.setDate(date.getDate() + 7 * count)
			break
		case 'month':
			d.setMonth(date.getMonth() + count)
			break
		case 'year':
			d.setFullYear(date.getFullYear() + count)
			break
	}
	return d
}

function addOperation(date: Date, amount: number, map: Map<string, number>) {
	const dateString = formatDate(date)
	const existingOperation = map.get(dateString) ?? 0
	map.set(dateString, existingOperation + amount)
}

export function processOperation(operation: Deposit | Withdrawal, map: Map<string, number>) {
	if (!operation.isRecurring) {
		addOperation(operation.startDate, operation.amount, map)
	} else {
		for (
			let date = new Date(operation.startDate);
			date <= operation.endDate;
			date = incrementDate(date, operation.frequency)
		) {
			addOperation(date, operation.amount, map)
		}
	}
}
