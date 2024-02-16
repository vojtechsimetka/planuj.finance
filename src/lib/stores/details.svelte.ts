import type { Deposit, Portfolio, Withdrawal } from '$lib/types'

interface DetailsStore {
	age: number
	endAge: number
	portfolio: Portfolio
	deposits: Deposit[]
	withdrawals: Withdrawal[]
}

export function withDetailsStore(): DetailsStore {
	let age = $state(18)
	let endAge = $state(80)
	let portfolio = $state<Portfolio>({ apy: 0, feeSuccess: 0, feeMangement: 0 })
	let deposits = $state<Deposit[]>([])
	let withdrawals = $state<Withdrawal[]>([])

	return {
		get age() {
			return age
		},
		set age(value) {
			age = value
		},
		get endAge() {
			return endAge
		},
		set endAge(value) {
			endAge = value
		},
		get portfolio() {
			return portfolio
		},
		set portfolio(value) {
			portfolio = value
		},
		get deposits() {
			return deposits
		},
		set deposits(value) {
			deposits = value
		},

		get withdrawals() {
			return withdrawals
		},
		set withdrawals(value) {
			withdrawals = value
		},
	}
}

export const detailStore = withDetailsStore()
