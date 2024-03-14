import type { Deposit, Withdrawal, Frequency } from './types'
import { formatDate } from './utils'

export function getEffectiveInterestRate(
	interest: number,
	successFee: number,
	managementFee: number,
	inflation: number,
) {
	const interestRate = interest / 100
	const successFeeRate = 1 - successFee / 100
	const successFeePercentage = interestRate - interestRate * successFeeRate
	const managementFeeRate = 1 - managementFee / 100
	const inflationRate = 1 - inflation / 100
	const effectiveInterestRate =
		(1 + interestRate * successFeeRate) * managementFeeRate * inflationRate - 1
	const managementFeePercentage =
		effectiveInterestRate - ((1 + interestRate * successFeeRate) * inflationRate - 1)

	return { effectiveInterestRate, successFeePercentage, managementFeePercentage }
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
			date < operation.endDate;
			date = incrementDate(date, operation.frequency)
		) {
			addOperation(date, operation.amount, map)
		}
	}
}
