import { getEffectiveInterestRate } from '$lib/calc'
import type { Deposit, Withdrawal } from '$lib/types'
import { detailStore } from './details.svelte'

function calculateTotal(deposits: Deposit[] | Withdrawal[]): number {
	let total: number = 0
	deposits.forEach((dep) => {
		if (!dep.isRecurring) {
			total += dep.amount
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
