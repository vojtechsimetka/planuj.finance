import { getEffectiveInterestRate } from '$lib/calc'
import type { Deposit, Withdrawal } from '$lib/types'
import { detailStore } from './details.svelte'

function calculateTotal(operation: Deposit[] | Withdrawal[]): number {
	let total: number = 0
	operation.forEach((o) => {
		if (o.isRecurring && o.endDate !== undefined && o.frequency !== undefined) {
			let timeOfInvestment =Math.floor(((o.endDate.getTime() - o.startDate.getTime() )/ o.frequency)/1000)
			total += o.amount * timeOfInvestment
		}else{
			total += o.amount
		}
	})
	return total
}

export function withResultsStore() {
	const effectiveApy = $derived(
		getEffectiveInterestRate(
			detailStore.portfolio.apy,
			detailStore.portfolio.feeSuccess,
			detailStore.portfolio.feeMangement,
			detailStore.inflation,
		),
	)
	const totalDeposited: number = $derived(calculateTotal(detailStore.deposits))
	const totalWithdrawn: number = $derived(calculateTotal(detailStore.withdrawals))

	return {
		get effectiveApy() {
			return effectiveApy
		},
		get totalDeposited() {
			return totalDeposited
		},
		get totalWithdrawn() {
			return totalWithdrawn
		},
	}
}

export const resultStore = withResultsStore()
