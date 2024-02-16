import { getEffectiveInterestRate } from '$lib/calc'
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

	return {
		get effectiveApy() {
			return effectiveApy
		},
	}
}

export const resultStore = withResultsStore()
