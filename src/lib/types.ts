export interface Deposit {
	name: string
	amount: number
	startDate: Date
	isRecurring: boolean
	endDate?: Date
	frequency?: number
}

export interface Portfolio {
	apy: number
	feeSuccess: number
	feeMangement: number
	entryFee: number
	withdrawalFee: number
}
export interface Withdrawal {
	name: string
	amount: number
	startDate: Date
	isRecurring: boolean
	endDate?: Date
	frequency?: number
}
export const Currencies: string[] = ['CZK', 'EUR', 'USD']
export type Currency = (typeof Currencies)[number]
