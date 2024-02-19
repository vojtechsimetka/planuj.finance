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
}
export interface Withdrawal {
	name: string
	amount: number
	startDate: Date
	isRecurring: boolean
	endDate?: Date
	frequency?: number
}
