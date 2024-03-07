<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements'
	import type { CurrencyWithLabel } from '$lib/types'
	import caretDown from '../assets/svg/caretDown.svg'

	interface Props extends HTMLSelectAttributes {
		labelFor?: string
		options: CurrencyWithLabel[]
	}
	let { labelFor = Math.random().toString(16), options, placeholder, value } = $props<Props>()
</script>

<div class="root">
	<img class="icon" src={caretDown} alt="" />
	<select bind:value class="select">
		{#each options as option}
			<option class="option" value={option.value}>{option.label}</option>
		{/each}
	</select>
	<label class="label" for={labelFor}>
		{placeholder}
	</label>
	<div class="error">
		<slot />
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
		top: 1rem;
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
		border: none;
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
		padding: 1.5rem 0.75rem;
		appearance: none;
		/* background-image: url('../assets/svg/sort_down.svg');
        background-position: right center;
        background-repeat: no-repeat; */
	}
	.select:focus-visible {
		border: 1px solid var(--colors-high);
		padding: 2.25rem 0.75rem 0.75rem;
		line-height: 1.5rem;
		font-size: 1rem;
		/* background-image: url('../assets/svg/sort_up.svg'); */
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
	.error {
		color: #ff3333;
		padding: 0.5rem 0.75rem 0;
	}
</style>
