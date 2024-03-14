import { getEffectiveInterestRate } from '$lib/calc'
import { formatDate, processOperation } from '$lib/utils'
import { detailStore } from './details.svelte'

interface GraphRecord {
	date: Date
	totalInvested: number
	totalDeposited: number
	totalWithdrawn: number
	totalFees: number
}

export function withResultsStore() {
	const effectiveApy = $derived(
		getEffectiveInterestRate(
			detailStore.apy,
			detailStore.feeSuccess,
			detailStore.feeManagement,
			detailStore.inflation,
		),
	)
	let totalDeposited: number = $state(0)
	let totalWithdrawn: number = $state(0)
	let totalDepositFees: number = $state(0)
	let totalWithdrawFees: number = $state(0)
	let totalInvested: number = $state(0)
	let totalFees: number = $state(0)

	function calculateGraph(): GraphRecord[] {
		const start = new Date(detailStore.dateOfBirth)
		const end = new Date(new Date(start).setFullYear(start.getFullYear() + detailStore.endAge))
		const graphData: GraphRecord[] = []
		const depositsMap = new Map<string, number>()
		const withdrawalsMap = new Map<string, number>()

		totalDeposited = 0
		totalWithdrawn = 0
		totalDepositFees = 0
		totalWithdrawFees = 0
		totalInvested = 0
		totalFees = 0

		detailStore.deposits.forEach((d) => processOperation(d, depositsMap))
		detailStore.withdrawals.forEach((w) => processOperation(w, withdrawalsMap))

		const dailyROI = Math.pow(1 + effectiveApy, 1 / 365.25)
		for (let i = new Date(start); i < end; i.setDate(i.getDate() + 1)) {
			totalInvested *= dailyROI
			const deposited = depositsMap.get(formatDate(i)) ?? 0
			const depositedFee = deposited * (detailStore.entryFee / 100)
			totalDeposited += deposited
			totalDepositFees += depositedFee

			const withdrawn = withdrawalsMap.get(formatDate(i)) ?? 0
			const withdrawnFee = withdrawn * (detailStore.withdrawalFee / 100)
			totalWithdrawn += withdrawn
			totalWithdrawFees += withdrawnFee

			totalInvested += deposited - depositedFee - withdrawnFee
			totalFees = totalDepositFees + totalWithdrawFees

			graphData.push({
				date: new Date(i),
				totalInvested,
				totalDeposited,
				totalWithdrawn,
				totalFees,
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
