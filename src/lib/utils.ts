function checkInt(x: number) {
	return (x | 0) === x
}

export function isInt(value: unknown) {
	return (
		!isNaN(Number(value)) &&
		((typeof value === 'string' && checkInt(parseFloat(value))) ||
			(typeof value === 'number' && checkInt(value)))
	)
}

export function getElementFromArray<T>(array: T[], index: unknown) {
	if (isInt(index)) {
		const i = index as number
		if (i >= 0 && i < array.length) {
			return array[i]
		}
	}
	return undefined
}
