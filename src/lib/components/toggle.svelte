<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'

	interface Props extends HTMLInputAttributes {
		labelFor?: string
	}
	let { labelFor = Math.random().toString(16), checked } = $props<Props>()
</script>

<div class="root">
	<input type="checkbox" class="toggle" id={labelFor} bind:checked />
	<label for={labelFor} class="label"><slot /></label>
</div>

<style>
	.root {
		width: 100%;
		display: flex;
		padding: 0.75rem;
		align-items: center;
		gap: 0.5rem;
		align-self: stretch;
	}
	.label {
		color: var(--colors-ultraHigh);
		font-family: Arial;
		font-size: 0.75rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
		cursor: pointer;
	}

	input[type='checkbox'] {
		--webbkit-appearance: none;
		--moz-appearance: none;
		appearance: none;
		cursor: pointer;
	}
	input[type='checkbox']:focus {
		outline: none;
	}
	.toggle {
		width: 2.5rem;
		height: 1.5rem;
		border-radius: 1rem;
		display: inline-block;
		position: relative;
		border: 0.06rem solid var(--colors-ultraHigh);
		background: transparent;
		transition: all 0.35s ease;
	}
	.toggle::after {
		content: '';
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		left: 0.2rem;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--colors-ultraHigh);
		transition: all 0.35s cubic-bezier(0.5, 0.1, 0.75, 1.35);
	}

	.toggle:checked {
		background: var(--colors-high);
		border: 0.06rem solid var(--colors-high);
	}
	.toggle:checked + .label {
		color: var(--colors-high);
	}
	.toggle:checked::after {
		transform: translateY(-50%) translateX(1rem);
		background: var(--colors-ultraLow);
	}
</style>
