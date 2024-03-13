<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements'
	import { CaretDown, CaretUp } from 'carbon-icons-svelte'

	interface Props extends HTMLSelectAttributes {
		helperText?: string
	}
	let { helperText, placeholder, value } = $props<Props>()
	let open = $state(false)
</script>

<div class="root">
	<div class="icon">
		{#if open}
			<CaretUp size={24} />
		{:else}
			<CaretDown size={24} />
		{/if}
	</div>
	<input bind:value class="select" onclick={() => (open = !open)} onblur={() => (open = false)} />
	<div class="label">
		{placeholder}
	</div>
	<div class="helper-text">
		{helperText}
	</div>
	{#if open}
		<slot />
	{/if}
</div>

<style>
	.root {
		position: relative;
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
</style>
