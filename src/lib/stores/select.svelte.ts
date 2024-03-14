export interface SelectStore {
	value?: string
	labels: Record<string, string>
	open: boolean

	registerValue(value: string, label?: string): void
}

export function withSelectStore(initialValue?: string): SelectStore {
	let value = $state<string | undefined>(initialValue)
	let labels = $state<Record<string, string>>({})
	let open = $state(false)

	function registerValue(newValue: string, newLabel?: string) {
		if (labels[newValue]) return

		labels[newValue] = newLabel ?? newValue
	}

	return {
		get value() {
			return value
		},
		set value(newValue) {
			value = newValue
		},
		get labels() {
			return labels
		},
		set labels(newValue) {
			labels = newValue
		},
		get open() {
			return open
		},
		set open(value) {
			open = value
		},

		registerValue,
	}
}
