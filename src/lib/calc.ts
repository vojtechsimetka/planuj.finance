import type { Deposit, Withdrawal } from './types'
import { day, week } from './utils'

export function getEffectiveInterestRate(
	interestRate: number,
	successFee: number,
	managementFee: number,
	inflation: number,
) {
	return (
		(1 + (interestRate / 100) * (1 - successFee / 100)) *
			(1 - managementFee / 100) *
			(1 - inflation / 100) -
		1
	)
}

export function calculateTotal(operation: Deposit[] | Withdrawal[]): number {
	let total: number = 0
	try {
		operation.forEach((o) => {
			if (o.isRecurring && o.endDate !== undefined && o.frequency !== undefined) {
				const startDate = new Date(o.startDate)
				const endDate = new Date(o.endDate)
				let timeOfInvestment = 0
				switch (o.frequency) {
					case 'day':
						timeOfInvestment = Math.floor((endDate.getTime() - startDate.getTime()) / day)
						break
					case 'week':
						timeOfInvestment = Math.floor((endDate.getTime() - startDate.getTime()) / week)
						break
					case 'month':
						timeOfInvestment = endDate.getMonth() - startDate.getMonth()
						timeOfInvestment += (endDate.getFullYear() - startDate.getFullYear()) * 12
						break
					case 'year':
						timeOfInvestment = endDate.getFullYear() - startDate.getFullYear()
						break
					default:
						break
				}

				total += o.amount * timeOfInvestment
				// We have to add the first deposit as well to have inclusive date limits
				total += o.amount
			} else {
				total += o.amount
			}
		})
		return total
	} catch (error) {
		console.error(error)
		return -1
	}
}
