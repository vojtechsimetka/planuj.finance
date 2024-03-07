<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements'
	import { CaretDown } from 'carbon-icons-svelte'

	interface Props extends HTMLSelectAttributes {
		labelFor?: string
		helperText?: string
	}
	let { labelFor = Math.random().toString(16), helperText, placeholder, value } = $props<Props>()
</script>

<div class="root">
	<div class="icon"><CaretDown size={24} /></div>
	<select bind:value class="select">
		<slot />
	</select>
	<label class="label" for={labelFor}>
		{placeholder}
	</label>
	<div class="helper-text">
		{helperText}
	</div>
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
		width: 100%;
	}
	.icon {
		position: absolute;
		top: 1.5rem;
		right: 0.75rem;
		width: 1.5rem;
		height: 1.5rem;
	}
	.iconRotate {
		transform: rotate(180deg);
	}
	.select {
		width: 100%;
		background: var(--colors-low);
		border: 1px solid var(--colors-low);
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
		padding: 1.5rem 0.75rem;
		appearance: none;
	}
	.select:focus-visible {
		border: 1px solid var(--colors-high);
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
		padding: 0.5rem 0.75rem 0;
	}
</style>
