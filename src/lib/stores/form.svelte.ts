import { _ } from 'svelte-i18n'
import { get } from 'svelte/store'
import type { Schema, ZodTypeDef } from 'zod'

export interface FormStore<T, V> {
	value: T
	parsedValue?: V
	isValid: boolean
	error: string[]
	edited: boolean
}

export function withFormStore<T, V>(
	initialValue: T,
	schema: Schema<V, ZodTypeDef, T>,
): FormStore<T, V> {
	let value = $state<T>(initialValue)
	let error = $state<string[]>([])
	let edited = $state(false)
	const { isValid, codes, parsedValue } = $derived.by(() => {
		const res = schema.safeParse(value)
		if (res.success) {
			return { isValid: true, codes: [], parsedValue: res.data }
		}

		return { isValid: false, codes: res.error.issues.map((i) => i.code) }
	})

	$effect(() => {
		edited = edited || value !== initialValue
	})

	$effect(() => {
		const translate = get(_)

		error = codes.map((c) => translate(`errors.${c}`))
	})

	_.subscribe((translate) => {
		error = codes.map((c) => translate(`errors.${c}`))
	})

	return {
		get value() {
			return value
		},
		set value(newValue) {
			value = newValue
		},
		get isValid() {
			return isValid
		},
		get error() {
			return error
		},
		get parsedValue() {
			return parsedValue
		},
		get edited() {
			return edited
		},
	}
}
