import { getEffectiveInterestRate, incrementDate, processOperation } from '$lib/calc'
import { formatDate } from '$lib/utils'
import { detailStore } from './details.svelte'

interface GraphRecord {
	date: Date
	totalInvested: number
	totalDeposited: number
	totalWithdrawn: number
	totalFees: number
	totalDepositFee: number
	totalWithdrawFee: number
	totalManagementFee: number
	totalSuccessFee: number
}

export function withResultsStore() {
	let effectiveApy = $state(0)
	let totalDeposited: number = $state(0)
	let totalWithdrawn: number = $state(0)
	let totalDepositFee: number = $state(0)
	let totalWithdrawFee: number = $state(0)
	let totalInvested: number = $state(0)
	let totalFees: number = $state(0)
	let graphData: GraphRecord[] = $state([])
	let totalSuccessFee: number = $state(0)
	let totalManagementFee: number = $state(0)

	function update() {
		const rates = getEffectiveInterestRate(
			detailStore.apy,
			detailStore.feeSuccess,
			detailStore.feeManagement,
			detailStore.inflation,
		)
		effectiveApy = rates.effectiveInterestRate
		const start = detailStore.dateOfBirth
		const end = incrementDate(start, 'year', detailStore.endAge)
		const gd: GraphRecord[] = []
		const depositsMap = new Map<string, number>()
		const withdrawalsMap = new Map<string, number>()

		totalDeposited = 0
		totalWithdrawn = 0
		totalDepositFee = 0
		totalWithdrawFee = 0
		totalInvested = 0
		totalFees = 0
		totalSuccessFee = 0
		totalManagementFee = 0

		detailStore.deposits.forEach((d) => processOperation(d, depositsMap))
		detailStore.withdrawals.forEach((w) => processOperation(w, withdrawalsMap))
		// const dailyManagement = Math.pow
		const dailyManagement = Math.pow(1 + rates.managementFeePercentage, 1 / 365.25)
		const dailySuccess = Math.pow(1 + rates.successFeePercentage, 1 / 365.25)
		const dailyROI = Math.pow(1 + effectiveApy, 1 / 365.25)

		for (let i = new Date(start); i < end; i = incrementDate(i, 'day')) {
			totalInvested *= dailyROI
			const deposited = depositsMap.get(formatDate(i)) ?? 0
			const depositedFee = deposited * (detailStore.entryFee / 100)
			totalDeposited += deposited
			totalDepositFee += depositedFee

			const withdrawn = withdrawalsMap.get(formatDate(i)) ?? 0
			const withdrawnFee = withdrawn * (detailStore.withdrawalFee / 100)
			totalWithdrawn += withdrawn
			totalWithdrawFee += withdrawnFee

			const managementFee = totalInvested - totalInvested * dailyManagement
			totalManagementFee += managementFee
			const successFee = totalInvested * dailySuccess - totalInvested
			totalSuccessFee += successFee

			totalInvested += deposited - depositedFee - withdrawn - withdrawnFee
			totalFees = totalDepositFee + totalWithdrawFee + totalManagementFee + totalSuccessFee

			gd.push({
				date: new Date(i),
				totalInvested,
				totalDeposited,
				totalWithdrawn,
				totalFees,
				totalManagementFee,
				totalSuccessFee,
				totalDepositFee,
				totalWithdrawFee,
			})
		}

		graphData = gd.filter((record) => record.date.getDate() === 1)
	}

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
		get totalDepositFee() {
			return totalDepositFee
		},
		get totalWithdrawFee() {
			return totalWithdrawFee
		},
		get totalManagementFee() {
			return totalManagementFee
		},
		get totalSuccessFee() {
			return totalSuccessFee
		},
		get totalInvested() {
			return totalInvested
		},
		get graphData() {
			return graphData
		},

		update,
	}
}

export const resultStore = withResultsStore()
