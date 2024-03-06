<!-- <script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements'

	interface Props extends HTMLAnchorAttributes {
		label: string
		type: string
	}
	let { label, type } = $props<Props>()
	let isActive = false
	let labelStyle = $state('')
	function handleFocus() {
		isActive = true
		labelStyle = 'active'
	}

	function handleBlur() {
		isActive = false
		labelStyle = 'active'
	}
</script>

<div class="root">
	<label>
		<span class={labelStyle}>{label}</span>
		<input type={`${type}`} on:focus={handleFocus} on:blur={handleBlur} />
	</label>
	<div>
		<slot />
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
	}
	label {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		align-self: stretch;
		border: none;
		border-radius: 0.25rem;
		padding: 1.5rem 0.75rem;
		color: var(--colors-high);
		background: var(--colors-low);
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1rem;
		letter-spacing: 0.0375rem;
	}
	span {
		position: relative;
		transition: 0.3s ease;
	}
	label:has(input:active, input:focus) {
		border: 0.06rem solid var(--colors-high);
		padding: 2.25rem 0.75rem 0.75rem;
	}
	input {
		width: 100%;
		background: var(--colors-low);
		border: none;
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
	}
	input:active,
	input:focus {
		color: var(--colors-top);
		background: var(--colors-base);
		border: none;
		outline: none;
	}
	.root > div {
		padding: 0.5rem 0.5rem;
	}
	.active {
		transform: translateY(-2rem);
		font-size: 0.75rem;
		line-height: 1rem;
		padding-top: 0.75rem;
	}
</style>
 -->
<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements'

	interface Props extends HTMLAnchorAttributes {
		labelFor: string
		type: string
		placeholder: string
	}
	let { type, labelFor, placeholder } = $props<Props>()
</script>

<div class="root">
	<input class="input" type={`${type}`} id={`${labelFor}`} placeholder={`${placeholder}`} />
	<label class="label" for={`${labelFor}`}>
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
	}
	.input {
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
	}
	.input:focus {
		border: 1px solid var(--colors-high);
		padding: 2.25rem 0.75rem 0.75rem;
		line-height: 1.5rem;
		font-size: 1rem;
	}
	.input::placeholder {
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
	.input:focus + .label,
	.input:not(:placeholder-shown) + .label {
		transform: translateY(-100%);
		font-size: 0.75rem;
		line-height: 1rem;
	}
	.input:not(:placeholder-shown) {
		padding: 2.25rem 0.75rem 0.75rem;
		color: var(--colors-ultraHigh);
	}
	.error {
		color: #ff3333;
		padding: 0.5rem 0.75rem 0;
	}
</style>
