import { getEffectiveInterestRate } from '$lib/calc'
import type { Deposit, Frequency, Withdrawal } from '$lib/types'
import { formatDate } from '$lib/utils'
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
		function incrementFunction(date: Date, frequency: Frequency) {
			const d = new Date(date.getTime())
			switch (frequency) {
				case 'day':
					d.setDate(date.getDate() + 1)
					break
				case 'week':
					d.setDate(date.getDate() + 7)
					break
				case 'month':
					d.setMonth(date.getMonth() + 1)
					break
				case 'year':
					d.setFullYear(date.getFullYear() + 1)
					break
			}
			return d
		}

		// TODO: Make this function general to be able to add to both deposit and withdrawal
		function addOperation(date: Date, amount: number, map: Map<string, number>) {
			const dateString = formatDate(date)
			const existingOperation = map.get(dateString) ?? 0
			map.set(dateString, existingOperation + amount)
		}

		// TODO: Make this function general to be able to add to both deposit and withdrawal
		function processOperation(operation: Deposit | Withdrawal, map: Map<string, number>) {
			if (!operation.isRecurring) {
				addOperation(operation.startDate, operation.amount, map)
			} else {
				for (
					let date = new Date(operation.startDate);
					date < operation.endDate;
					date = incrementFunction(date, operation.frequency)
				) {
					addOperation(date, operation.amount, map)
				}
			}
		}
		detailStore.deposits.forEach((d) => processOperation(d, depositsMap))
		detailStore.withdrawals.forEach((w) => processOperation(w, withdrawalsMap))

		const dailyROI = Math.pow(1 + effectiveApy, 1 / 365.25)
		for (let i = new Date(start); i < end; i.setDate(i.getDate() + 1)) {
			totalInvested *= dailyROI
			const deposited = depositsMap.get(formatDate(i)) ?? 0
			const depositedFee = deposited * (detailStore.entryFee / 100)
			totalDeposited += deposited
			totalDepositFees += depositedFee

			const withdrawan = withdrawalsMap.get(formatDate(i)) ?? 0
			const withdrawanFee = withdrawan * (detailStore.withdrawalFee / 100)
			totalWithdrawn += withdrawan
			totalWithdrawFees += withdrawanFee

			totalInvested += deposited - depositedFee - withdrawanFee
			totalFees += totalDepositFees + totalWithdrawFees
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
