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

	const totalDepositFees: number = $derived(totalDeposited * (detailStore.portfolio.entryFee / 100))
	const totalWithdrawFees: number = $derived(
		totalWithdrawn * (detailStore.portfolio.withdrawalFee / 100),
	)

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
		get totalDepositFees() {
			return totalDepositFees
		},
		get totalWithdrawFees() {
			return totalWithdrawFees
		},
	}
}

export const resultStore = withResultsStore()
