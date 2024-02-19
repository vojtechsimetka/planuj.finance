import type { Deposit, Portfolio, Withdrawal } from '$lib/types'
import { base64ToBytes, bytesToBase64 } from '$lib/utils'
import pako from 'pako'

export interface DetailsStore {
	age: number
	endAge: number
	inflation: number
	portfolio: Portfolio
	deposits: Deposit[]
	withdrawals: Withdrawal[]

	addDeposit: (deposit: Deposit) => void
	removeDeposit: (index: number) => void
	saveDeposit: (index: number, deposit: Deposit) => void
	addWithdrawal: (withdrawal: Withdrawal) => void
	removeWithdrawal: (index: number) => void
	saveWithdrawal: (index: number, withdrawal: Withdrawal) => void
	toUrl: () => string
	restoreFromUrl: (url: string) => void
}

function add<T>(array: T[], item: T) {
	array.push(item)
}

function remove<T>(array: T[], index: number) {
	if (index >= 0 && index < array.length) {
		array.splice(index, 1)
	}
}
function save<T>(array: T[], index: number, item: T) {
	if (index >= 0 && index < array.length) {
		array[index] = item
	}
}

export function withDetailsStore(): DetailsStore {
	let age = $state(18)
	let endAge = $state(80)
	let inflation = $state(0)
	let portfolio = $state<Portfolio>({
		apy: 0,
		feeSuccess: 0,
		feeMangement: 0,
		entryFee: 0,
		withdrawalFee: 0,
	})
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
		get inflation() {
			return inflation
		},
		set inflation(value) {
			inflation = value
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

		addDeposit(deposit) {
			add(deposits, deposit)
		},
		removeDeposit(index) {
			remove(deposits, index)
		},
		saveDeposit(index, deposit) {
			save(deposits, index, deposit)
		},
		addWithdrawal(withdrawal) {
			add(withdrawals, withdrawal)
		},
		removeWithdrawal(index) {
			remove(withdrawals, index)
		},
		saveWithdrawal(index, withdrawal) {
			save(withdrawals, index, withdrawal)
		},
		toUrl() {
			const data = JSON.stringify({
				age,
				endAge,
				inflation,
				portfolio,
				deposits,
				withdrawals,
			})
			return bytesToBase64(pako.deflate(data))
		},
		restoreFromUrl(url: string) {
			try {
				const uint8 = base64ToBytes(url)
				const decodedData = pako.inflate(uint8, { to: 'string' })
				const data = JSON.parse(decodedData)

				age = data.age
				endAge = data.endAge
				inflation = data.inflation
				// FIXME: should use different comparison which does not require string allocation
				if (JSON.stringify(portfolio) !== JSON.stringify(data.portfolio)) portfolio = data.portfolio
				if (JSON.stringify(deposits) !== JSON.stringify(data.deposits)) deposits = data.deposits
				if (JSON.stringify(withdrawals) !== JSON.stringify(data.withdrawals))
					withdrawals = data.withdrawals
			} catch (error) {
				console.error('Error restoring from URL', error)
			}
		},
	}
}

export const detailStore = withDetailsStore()
