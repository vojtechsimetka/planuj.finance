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

const supportedCurrencies = ['CZK', 'EUR', 'USD'] as const
export type Currency = (typeof supportedCurrencies)[number]

interface CurrencyWithLabel {
	label: string
	value: Currency
}
export const supportedCurrenciesWithLabels: CurrencyWithLabel[] = [
	{
		value: 'CZK',
		label: 'Kč',
	},
	{
		value: 'EUR',
		label: '€',
	},
	{
		value: 'USD',
		label: '$',
	},
] as const
