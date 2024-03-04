import { z } from 'zod'
import type { depositWithdrawalFormSchema, depositWithdrawalSchema } from './schemas'

export type DepositForm = z.infer<typeof depositWithdrawalFormSchema>
export type WithdrawalForm = z.infer<typeof depositWithdrawalFormSchema>
export type Deposit = z.infer<typeof depositWithdrawalSchema>
export type Withdrawal = z.infer<typeof depositWithdrawalSchema>

export interface Portfolio {
	apy: number
	feeSuccess: number
	feeMangement: number
	entryFee: number
	withdrawalFee: number
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
