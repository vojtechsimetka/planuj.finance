import { z } from 'zod'
import type {
	depositWithdrawalFormSchema,
	depositWithdrawalSchema,
	frequencySchema,
	portfolioSchema,
	supportedCurrenciesSchema,
} from './schemas'

export type DepositForm = z.infer<typeof depositWithdrawalFormSchema>
export type WithdrawalForm = z.infer<typeof depositWithdrawalFormSchema>
export type Deposit = z.infer<typeof depositWithdrawalSchema>
export type Withdrawal = z.infer<typeof depositWithdrawalSchema>
export type Portfolio = z.infer<typeof portfolioSchema>
export type Currency = z.infer<typeof supportedCurrenciesSchema>
export type Frequency = z.infer<typeof frequencySchema>

export interface CurrencyWithLabel {
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
