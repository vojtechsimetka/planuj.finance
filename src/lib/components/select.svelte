<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import { CaretDown, CaretUp } from 'carbon-icons-svelte'
	import { setContext } from 'svelte'
	import { withSelectStore } from '$lib/stores/select.svelte'

	interface Props extends HTMLInputAttributes {
		helperText?: string
		labelFor?: string
	}
	let {
		labelFor = Math.random().toString(16),
		helperText,
		placeholder,
		value,
		children,
		...restProps
	} = $props<Props>()

	const store = withSelectStore(value)
	setContext('select-store', store)

	$effect(() => {
		value = store.value
	})
</script>

<div class="root">
	<div class="wrapper">
		<div class="icon">
			{#if store.open}
				<CaretUp size={24} />
			{:else}
				<CaretDown size={24} />
			{/if}
		</div>
		<input
			value={store.value ? store.labels[store.value] : value}
			class="select"
			onclick={(e) => {
				e.preventDefault()
				e.stopPropagation()
				store.open = !store.open
			}}
			onkeydown={(e) => {
				if (e.key === 'ArrowDown') {
					e.preventDefault()
					e.stopPropagation()
					store.open = true
				}
			}}
			id={labelFor}
			{placeholder}
			readonly
			{...restProps}
		/>
		<label class="label" for={labelFor}>
			{placeholder}
		</label>
		<div class="options" class:hidden={!store.open}>
			{#if children}
				{@render children()}
			{/if}
		</div>
	</div>
	<div class="helper-text">
		{helperText}
	</div>
</div>

<style>
	.root {
		color: var(--colors-ultraHigh);
		font-family: Arial;
		font-size: 0.75rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1rem;
		letter-spacing: 0.0375rem;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
	}
	.wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		flex-grow: 1;
	}
	.icon {
		position: absolute;
		top: 1.5rem;
		right: 0.75rem;
		width: 1.5rem;
		height: 1.5rem;
	}
	.select {
		background: var(--colors-low);
		border: 1px solid var(--colors-low);
		border-radius: 0.25rem;
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
		padding: 1.5rem 0.75rem;
		appearance: none;
		flex-grow: 1;
		cursor: pointer;
	}
	.select:focus-visible {
		border: 1px solid var(--colors-high);
		outline: none;
		background: var(--colors-base);
		padding: 2.25rem 0.75rem 0.75rem;
		line-height: 1.5rem;
		font-size: 1rem;
	}
	.select::placeholder {
		text-align: center;
		color: transparent;
	}
	.label {
		position: absolute;
		top: 1.75rem;
		left: 0.75rem;
		pointer-events: none;
		transform-origin: left center;
		transition: transform 0.25s;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: center;
		align-self: stretch;
		border: none;
		border-radius: 0.25rem;
		color: var(--colors-high);
		background: var(--colors-low);
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1rem;
		letter-spacing: 0.0375rem;
	}
	.select:focus + .label {
		background: var(--colors-base);
	}
	.select:focus + .label,
	.select:not(:placeholder-shown) + .label {
		transform: translateY(-100%);
		font-size: 0.75rem;
		line-height: 1rem;
	}
	.select:not(:placeholder-shown) {
		padding: 2.25rem 0.75rem 0.75rem;
		color: var(--colors-ultraHigh);
	}
	.helper-text {
		padding: 0.5rem 0.75rem;
	}
	.options {
		position: absolute;
		top: 100%;
		left: 0;
		/* FIXME: remove the calc and solve this with nesting */
		width: calc(100% - 1rem);
		border-radius: 0.25rem;
		border: 1px solid var(--colors-high);
		background: var(--colors-base);
		z-index: 1;
		list-style: none;
		margin: 0;
		padding: 0.5rem;
		margin-top: 0.25rem;
		display: flex;
		flex-direction: column;
		justify-content: stretch;
	}
	.hidden {
		display: none;
	}
</style>
