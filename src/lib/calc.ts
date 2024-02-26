import { detailStore } from './stores/details.svelte'
import type { Deposit, Withdrawal } from './types'

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
				const startDate = new Date(o.startDate).getTime()
				const endDate = new Date(o.endDate).getTime()
				const timeOfInvestment = Math.floor((endDate - startDate) / o.frequency / 1000)
				total += o.amount * timeOfInvestment
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

	export function calculateFee(totalDeposited: number, totalWithdrawn: number) {
		let totalDepositFees: number = totalDeposited * (detailStore.portfolio.entryFee / 100)
		let totalWithdrawFees: number = totalWithdrawn * (detailStore.portfolio.withdrawalFee / 100)
		return { totalDepositFees, totalWithdrawFees }
	}
