<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'

	interface Props extends HTMLButtonAttributes {
		variant: 'primary' | 'secondary' | 'ghost' | 'overlay' | 'darkoverlay'
		active?: boolean
		onclick?: () => void
	}
	let { variant, active, disabled, onclick } = $props<Props>()
</script>

<button class={`${variant}`} class:active {disabled} {onclick}>
	<slot />
</button>

<style>
	button {
		display: inline-flex;
		padding: 12px;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.25rem;
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
		border: 1px solid var(--colors-ultraHigh);
		cursor: pointer;
	}
	.primary {
		background: var(--colors-ultraHigh);
		color: var(--colors-ultraLow);
	}
	.primary:active,
	.primary.active {
		background: var(--colors-high);
		border: 1px solid var(--colors-high);
	}
	.primary:disabled {
		opacity: 0.25;
	}
	.secondary {
		background: inherit;
		border: 1px solid var(--colors-ultraHigh);
		color: var(--colors-ultraHigh);
	}
	.secondary:active,
	.secondary.active {
		border: 1px solid var(--colors-high);
		color: var(--colors-high);
	}
	.secondary:disabled {
		opacity: 0.25;
	}
	.ghost {
		border: none;
		background: transparent;
		color: var(--colors-ultraHigh);
	}
	.ghost:active,
	.ghost.active {
		background: var(--colors-low);
		color: var(--colors-high);
	}
	.ghost:disabled {
		opacity: 0.25;
	}
	.overlay {
		border: none;
		background: var(--colors-base);
		color: var(--colors-ultraHigh);
	}
	.overlay:active,
	.overlay.active {
		background: var(--colors-low);
		color: var(--colors-high);
	}
	.overlay:disabled {
		background: var(--colors-base);
		opacity: 0.25;
	}
	.darkoverlay {
		border: none;
		background: var(--colors-darkOverlay);
		color: var(--colors-baseOverlay);
	}
</style>
