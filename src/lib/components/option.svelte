<script lang="ts">
	import type { SelectStore } from '$lib/stores/select.svelte'
	import { getContext } from 'svelte'
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props extends HTMLButtonAttributes {
		value: string
	}
	let { value, children, ...restProps } = $props<Props>()

	const store = getContext<SelectStore>('select-store')

	let liElement = $state<HTMLButtonElement | undefined>()

	const updateLabel = () => {
		if (liElement && liElement.childNodes.length > 0) {
			const filteredNodes = Array.from(liElement.childNodes).filter(
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
	bind:this={liElement}
	onclick={(e: MouseEvent) => {
		if (!store.open) return
		e.preventDefault()
		e.stopPropagation()
		store.open = false
		store.value = value
	}}
	class:selected
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
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
	}
	button.selected,
	button:hover {
		background-color: var(--colors-low);
		border-radius: 0.25rem;
		cursor: pointer;
	}
</style>
