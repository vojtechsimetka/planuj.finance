import { getEffectiveInterestRate } from '$lib/calc'
import type { Deposit, Withdrawal } from '$lib/types'
import { detailStore } from './details.svelte'

function calculateTotal(deposits: Deposit[]): number {
	let total: number = 0
	console.count('calculateTotal' + deposits.length)
	deposits.forEach((dep) => {
		if (!dep.isRecurring) {
			total += dep.amount
			console.count('inside')
		}
	})
	$inspect(total, deposits)
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
	let totalDeposited: number = $derived(calculateTotal(detailStore.deposits))
	const totalWithdrawn: number = $state(0)

	$inspect(detailStore.deposits.length)

	return {
		get effectiveApy() {
			return effectiveApy
		},
		totalDeposited,
	}
}

export const resultStore = withResultsStore()
