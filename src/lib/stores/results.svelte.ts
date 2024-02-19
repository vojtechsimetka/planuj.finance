import { calculateTotal, getEffectiveInterestRate } from '$lib/calc'
import { detailStore } from './details.svelte'

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
