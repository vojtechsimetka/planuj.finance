import { detailStore } from './details.svelte'

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
