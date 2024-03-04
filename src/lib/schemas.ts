import { z } from 'zod'

function toDate(value: string): Date {
	const parsedDate = new Date(value)
	if (isNaN(parsedDate.getTime())) {
		throw new Error('Invalid date format')
	}
	return parsedDate
}

export const commonDepositWithdrawalFormSchema = z.object({
	name: z.string().min(1),
	amount: z.number().positive(),
	startDate: z.string().refine(toDate, { message: 'Invalid date format' }),
})

export const depositWithdrawalFormSchema = z.discriminatedUnion('isRecurring', [
	commonDepositWithdrawalFormSchema.extend({
		isRecurring: z.literal(false),
	}),
	commonDepositWithdrawalFormSchema.extend({
		isRecurring: z.literal(true),
		endDate: z.string().refine(toDate, { message: 'Invalid date format' }),
		frequency: z.enum(['day', 'week', 'month', 'year']),
	}),
])

export const commonDepositWithdrawalSchema = z.object({
	name: z.string().min(1),
	amount: z.number().positive(),
	startDate: z.string().transform(toDate),
})

export const depositWithdrawalSchema = z.discriminatedUnion('isRecurring', [
	commonDepositWithdrawalSchema.extend({
		isRecurring: z.literal(false),
	}),
	commonDepositWithdrawalSchema.extend({
		isRecurring: z.literal(true),
		endDate: z.string().transform(toDate),
		frequency: z.enum(['day', 'week', 'month', 'year']),
	}),
])
