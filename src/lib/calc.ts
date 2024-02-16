export function getEffectiveInterestRate(
	interestRate: number,
	successFee: number,
	managementFee: number,
	inflation: number,
) {
	return (
		(1 + (interestRate / 100) * (1 - successFee / 100)) *
			(1 - managementFee / 100) *
			(1 - inflation / 100) -
		1
	)
}
