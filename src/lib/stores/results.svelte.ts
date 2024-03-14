import { calculateTotal, getEffectiveInterestRate } from '$lib/calc'
import type { Deposit, Frequency } from '$lib/types'
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
	const totalDeposited: number = $derived(calculateTotal(detailStore.deposits))
	const totalWithdrawn: number = $derived(calculateTotal(detailStore.withdrawals))

	const totalDepositFees: number = $derived(totalDeposited * (detailStore.entryFee / 100))
	const totalWithdrawFees: number = $derived(totalWithdrawn * (detailStore.withdrawalFee / 100))

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
		let totalFees = 0

		const depositsMap = new Map<string, number>()

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
		function addDeposit(date: Date, amount: number) {
			const dateString = formatDate(date)
			const existingDeposit = depositsMap.get(dateString) ?? 0
			depositsMap.set(dateString, existingDeposit + amount)
		}

		// TODO: Make this function general to be able to add to both deposit and withdrawal
		function processOperation(deposit: Deposit) {
			if (!deposit.isRecurring) {
				addDeposit(deposit.startDate, deposit.amount)
			} else {
				for (
					let date = new Date(deposit.startDate);
					date < deposit.endDate;
					date = incrementFunction(date, deposit.frequency)
				) {
					addDeposit(date, deposit.amount)
				}
			}
		}

		detailStore.deposits.forEach(processOperation)

		const dailyROI = Math.pow(1 + effectiveApy, 1 / 365.25)
		for (let i = new Date(start); i < end; i.setDate(i.getDate() + 1)) {
			totalInvested *= dailyROI

			// Calculate deposits
			const deposited = depositsMap.get(formatDate(i)) ?? 0
			const fee = deposited * (detailStore.entryFee / 100)
			totalDeposited += deposited
			totalInvested += deposited - fee
			totalFees += fee

			// Calculate deposits
			// TODO: Implement recurring withdrawals
			detailStore.withdrawals.forEach((withdrawal) => {
				if (!withdrawal.isRecurring && isEqualDate(new Date(withdrawal.startDate), i)) {
					const fee = withdrawal.amount * (detailStore.withdrawalFee / 100)
					totalInvested -= withdrawal.amount + fee
					totalWithdrawn += withdrawal.amount
					totalFees += fee
				}

				// TODO: Implement recurring withdrawals
			})

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
