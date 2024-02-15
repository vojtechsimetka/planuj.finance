export interface Deposit {
	name: string
	amount: number
	startDate: Date
	endDate?: Date
	frequency: number
}

export interface Portfolio {
	apy: number
	feeSuccess: number
	feeMangement: number
}
