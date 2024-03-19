import { Decimal } from 'decimal.js'
import {
	getEffectiveInterestRate,
	incrementDate,
	processOperation,
	splitWithRation,
} from '$lib/calc'
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
			new Decimal(detailStore.apy),
			new Decimal(detailStore.feeSuccess),
			new Decimal(detailStore.feeManagement),
			new Decimal(detailStore.inflation),
		)
		effectiveApy = rates.effectiveInterestRate.toNumber()
		const ratesNoFees = getEffectiveInterestRate(
			new Decimal(detailStore.apy),
			new Decimal(0),
			new Decimal(0),
			new Decimal(detailStore.inflation),
		)

		const start = detailStore.dateOfBirth
		const end = incrementDate(start, 'year', detailStore.endAge)
		const gd: GraphRecord[] = []
		const depositsMap = new Map<string, number>()
		const withdrawalsMap = new Map<string, number>()

		let newTotalDeposited = new Decimal(0)
		let newTotalWithdrawn = new Decimal(0)
		let newTotalDepositFee = new Decimal(0)
		let newTotalWithdrawFee = new Decimal(0)
		let newTotalInvested = new Decimal(0)
		let newTotalFees = new Decimal(0)
		let newTotalSuccessFee = new Decimal(0)
		let newTotalManagementFee = new Decimal(0)

		detailStore.deposits.forEach((d) => processOperation(d, depositsMap))
		detailStore.withdrawals.forEach((w) => processOperation(w, withdrawalsMap))

		const dailyROI = new Decimal(1).add(effectiveApy).pow(new Decimal(1).div(new Decimal(365.25)))
		const dailyNoFeesROI = new Decimal(1)
			.add(ratesNoFees.effectiveInterestRate)
			.pow(new Decimal(1).div(new Decimal(365.25)))

		for (let i = new Date(start); i <= end; i = incrementDate(i, 'day')) {
			newTotalInvested = newTotalInvested.mul(dailyROI)
			const deposited = new Decimal(depositsMap.get(formatDate(i)) ?? 0)
			const depositedFee = deposited.mul(new Decimal(detailStore.entryFee).div(100))
			newTotalDeposited = newTotalDeposited.add(deposited)
			newTotalDepositFee = newTotalDepositFee.add(depositedFee)

			const withdrawn = new Decimal(withdrawalsMap.get(formatDate(i)) ?? 0)
			const withdrawnFee = withdrawn.mul(new Decimal(detailStore.withdrawalFee).div(100))
			newTotalWithdrawn = newTotalWithdrawn.add(withdrawn)
			newTotalWithdrawFee = newTotalWithdrawFee.add(withdrawnFee)

			const fee = newTotalInvested.mul(dailyNoFeesROI).sub(newTotalInvested.mul(dailyROI))
			const [managementFee, successFee] = splitWithRation(
				rates.managementFeePercentage,
				rates.successFeePercentage,
				fee,
			)
			newTotalManagementFee = newTotalManagementFee.add(managementFee)
			newTotalSuccessFee = newTotalSuccessFee.add(successFee)

			newTotalInvested = newTotalInvested
				.add(deposited)
				.sub(depositedFee)
				.sub(withdrawn)
				.sub(withdrawnFee)
			newTotalFees = newTotalDepositFee
				.add(newTotalWithdrawFee)
				.add(newTotalManagementFee)
				.add(newTotalSuccessFee)

			gd.push({
				date: new Date(i),
				totalInvested: newTotalInvested.toNumber(),
				totalDeposited: newTotalDeposited.toNumber(),
				totalWithdrawn: newTotalWithdrawn.toNumber(),
				totalFees: newTotalFees.toNumber(),
				totalManagementFee: newTotalManagementFee.toNumber(),
				totalSuccessFee: newTotalSuccessFee.toNumber(),
				totalDepositFee: newTotalDepositFee.toNumber(),
				totalWithdrawFee: newTotalWithdrawFee.toNumber(),
			})
		}

		totalDepositFee = newTotalDepositFee.toNumber()
		totalWithdrawFee = newTotalWithdrawFee.toNumber()
		totalManagementFee = newTotalManagementFee.toNumber()
		totalSuccessFee = newTotalSuccessFee.toNumber()
		totalInvested = newTotalInvested.toNumber()
		totalFees = newTotalFees.toNumber()
		totalDeposited = newTotalDeposited.toNumber()
		totalWithdrawn = newTotalWithdrawn.toNumber()
		graphData = gd
			.filter((record) => record.date.getDate() === 1)
			.filter((record) => record.date.getMonth() % 12 === 0)
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
		get totalFees() {
			return totalFees
		},

		update,
	}
}

export const resultStore = withResultsStore()
