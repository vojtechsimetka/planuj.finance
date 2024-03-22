import { Decimal } from 'decimal.js'
import {
	getEffectiveInterestRate,
	incrementDate,
	processOperation,
	splitWithRation,
} from '$lib/calc'
import { formatDate } from '$lib/utils'
import { detailStore } from './details.svelte'

export function withResultsStore() {
	let graphDates: number[] = $state([])
	let graphTotalInvested: number[] = $state([])
	let graphTotalDeposited: number[] = $state([])
	let graphTotalWithdrawn: number[] = $state([])
	let graphTotalFees: number[] = $state([])
	let graphTotalDepositFee: number[] = $state([])
	let graphTotalWithdrawFee: number[] = $state([])
	let graphTotalManagementFee: number[] = $state([])
	let graphTotalSuccessFee: number[] = $state([])
	let effectiveApy = $state(0)
	let totalDeposited: number = $state(0)
	let totalWithdrawn: number = $state(0)
	let totalDepositFee: number = $state(0)
	let totalWithdrawFee: number = $state(0)
	let totalInvested: number = $state(0)
	let totalFees: number = $state(0)
	let totalSuccessFee: number = $state(0)
	let totalManagementFee: number = $state(0)
	let investedValueError: string | undefined = $state(undefined)

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
		const depositsMap = new Map<string, number>()
		const withdrawalsMap = new Map<string, number>()
		graphDates = []
		graphTotalInvested = []
		graphTotalDeposited = []
		graphTotalWithdrawn = []
		graphTotalFees = []
		graphTotalDepositFee = []
		graphTotalWithdrawFee = []
		graphTotalManagementFee = []
		graphTotalSuccessFee = []
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
			if (newTotalInvested >= new Decimal(0)) {
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
				if (i.getDate() === 1) {
					graphDates.push(new Date(i).getFullYear())
					graphTotalInvested.push(newTotalInvested.toNumber())
					graphTotalDeposited.push(newTotalDeposited.toNumber())
					graphTotalWithdrawn.push(newTotalWithdrawn.toNumber())
					graphTotalDepositFee.push(newTotalDepositFee.toNumber())
					graphTotalWithdrawFee.push(newTotalWithdrawFee.toNumber())
					graphTotalFees.push(newTotalFees.toNumber())
					graphTotalManagementFee.push(newTotalManagementFee.toNumber())
					graphTotalSuccessFee.push(newTotalSuccessFee.toNumber())
				}
				investedValueError = undefined
			} else {
				investedValueError = incrementDate(i, 'day', -1).toLocaleDateString()
				return
			}
		}

		totalDepositFee = newTotalDepositFee.toNumber()
		totalWithdrawFee = newTotalWithdrawFee.toNumber()
		totalManagementFee = newTotalManagementFee.toNumber()
		totalSuccessFee = newTotalSuccessFee.toNumber()
		totalInvested = newTotalInvested.toNumber()
		totalFees = newTotalFees.toNumber()
		totalDeposited = newTotalDeposited.toNumber()
		totalWithdrawn = newTotalWithdrawn.toNumber()
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
		get totalFees() {
			return totalFees
		},
		get graphDates() {
			return graphDates
		},
		get graphTotalInvested() {
			return graphTotalInvested
		},
		get graphTotalDeposited() {
			return graphTotalDeposited
		},
		get graphTotalWithdrawn() {
			return graphTotalWithdrawn
		},
		get graphTotalDepositFee() {
			return graphTotalDepositFee
		},
		get graphTotalWithdrawFee() {
			return graphTotalWithdrawFee
		},
		get graphTotalFees() {
			return graphTotalFees
		},
		get graphTotalManagementFee() {
			return graphTotalManagementFee
		},
		get graphTotalSuccessFee() {
			return graphTotalSuccessFee
		},
		get investedValueError() {
			return investedValueError
		},

		update,
	}
}

export const resultStore = withResultsStore()
