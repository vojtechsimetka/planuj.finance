<script lang="ts">
	import type { SelectStore } from '$lib/stores/select.svelte'
	import { getContext } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props extends HTMLButtonAttributes {
		value: string
	}
	let { value, ...restProps }: Props = $props()

	const store = getContext<SelectStore>('select-store')

	let buttonElement = $state<HTMLButtonElement | undefined>()

	const updateLabel = () => {
		if (buttonElement && buttonElement.childNodes.length > 0) {
			const filteredNodes = Array.from(buttonElement.childNodes).filter(
				(node) => node.nodeType !== Node.COMMENT_NODE,
			)
			const content = filteredNodes.map((node) => node.nodeValue).join('')
			store.registerValue(value, content)
		}
	}
	$effect(() => {
		updateLabel()
	})

	let selected = $derived(store.value === value)
</script>

<button
	bind:this={buttonElement}
	onclick={(e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		store.open = false
		store.value = value
	}}
	class:selected
	{...restProps}
>
	<slot />
</button>

<style>
	button {
		background: none;
		border: none;
		color: var(--colors-ultraHigh, #303030);
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem; /* 150% */
		letter-spacing: 0.02rem;
		padding: 0.75rem;
		display: flex;
		justify-content: flex-start;
	}
	button:focus {
		outline: 1px solid var(--colors-high);
	}
	button.selected,
	button:hover,
	button:focus,
	button.active {
		background-color: var(--colors-low);
		border-radius: 0.25rem;
		cursor: pointer;
	}
</style>
