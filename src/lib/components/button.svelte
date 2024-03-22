<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements'
	type Variant = 'primary' | 'secondary' | 'ghost' | 'overlay' | 'darkoverlay'
	type Props = {
		variant: Variant
		active?: boolean
		class?: string | null
	}
	interface AnchorElement extends HTMLAnchorAttributes, Props {
		href?: HTMLAnchorAttributes['href']
		type?: never
		disabled?: never
	}

	interface ButtonElement extends HTMLButtonAttributes, Props {
		type?: HTMLButtonAttributes['type']
		href?: never
		disabled?: boolean
	}
	type Propss = AnchorElement | ButtonElement
	let { variant, active, disabled, href, ...restProps }: Propss = $props()
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	class={`${variant}`}
	{href}
	class:active
	{disabled}
	{...restProps}
>
	<slot />
</svelte:element>

<style>
	button,
	a {
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
		text-decoration: none;
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
