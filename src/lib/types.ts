import { z } from 'zod'
import type {
	depositWithdrawalFormSchema,
	depositWithdrawalSchema,
	portfolioSchema,
	supportedCurrenciesSchema,
} from './schemas'

export type DepositForm = z.infer<typeof depositWithdrawalFormSchema>
export type WithdrawalForm = z.infer<typeof depositWithdrawalFormSchema>
export type Deposit = z.infer<typeof depositWithdrawalSchema>
export type Withdrawal = z.infer<typeof depositWithdrawalSchema>
export type Portfolio = z.infer<typeof portfolioSchema>
export type Currency = z.infer<typeof supportedCurrenciesSchema>

export type CurrencyWithLabel = Record<Currency, string>

export const supportedCurrenciesWithLabels: CurrencyWithLabel = {
	CZK: 'Kč',
	EUR: '€',
	USD: '$',
} as const
