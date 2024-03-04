import { calculateTotal, getEffectiveInterestRate } from '$lib/calc'
import { detailStore } from './details.svelte'

interface GraphRecord {
	date: Date
	totalInvested: number
	totalDeposited: number
	totalWithdrawn: number
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

	const totalDepositFees: number = $derived(totalDeposited * (detailStore.portfolio.entryFee / 100))
	const totalWithdrawFees: number = $derived(
		totalWithdrawn * (detailStore.portfolio.withdrawalFee / 100),
	)

	function isEqualDate(a: Date, b: Date): boolean {
		return (
			a.getDate() === b.getDate() &&
			a.getMonth() === b.getMonth() &&
			a.getFullYear() === b.getFullYear()
		)
	}

	function calculateGraph(): GraphRecord[] {
		const start = new Date(detailStore.dateOfBirth)
		const end = new Date(new Date(start).setFullYear(start.getFullYear() + detailStore.endAge))

		const graphData: GraphRecord[] = []

		let totalInvested = 0
		let totalDeposited = 0
		let totalWithdrawn = 0

		const dailyROI = Math.pow(1 + effectiveApy, 1 / 365.25)
		for (let i = new Date(start); i < end; i.setDate(i.getDate() + 1)) {
			totalInvested *= dailyROI

			detailStore.deposits.forEach((deposit) => {
				if (!deposit.isRecurring && isEqualDate(new Date(deposit.startDate), i)) {
					totalDeposited += deposit.amount
					totalInvested += deposit.amount * (1 - detailStore.portfolio.entryFee / 100)
				}

				// TODO: Implement recurring deposits
			})

			detailStore.withdrawals.forEach((withdrawal) => {
				if (!withdrawal.isRecurring && isEqualDate(new Date(withdrawal.startDate), i)) {
					totalInvested -= withdrawal.amount * (1 + detailStore.portfolio.withdrawalFee / 100)
					totalWithdrawn += withdrawal.amount
				}
			})

			graphData.push({
				date: new Date(i),
				totalInvested,
				totalDeposited,
				totalWithdrawn,
			})
		}

		return graphData.filter((record) => record.date.getDate() === 1)
	}

	const graphData: GraphRecord[] = $derived(calculateGraph())

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
		get graphData() {
			return graphData
		},
	}
}

export const resultStore = withResultsStore()
