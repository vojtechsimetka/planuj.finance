<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'

	interface Props extends HTMLInputAttributes {
		labelFor?: string
		readonly?: boolean
	}
	let {
		labelFor = Math.random().toString(16),
		placeholder,
		value,
		readonly = false,
		disabled,
		...restProps
	}: Props = $props()
</script>

<div class="root" class:readonly class:disabled>
	<input
		class="input"
		id={labelFor}
		bind:value
		{placeholder}
		disabled={disabled || readonly}
		{...restProps}
	/>
	<label class="label" for={labelFor}>
		{placeholder}
	</label>
	<div class="helper-text">
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
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
	}

	.root.disabled {
		pointer-events: none;
		cursor: pointer;
	}
	.input {
		background: var(--colors-low);
		border: 1px solid var(--colors-low);
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
		padding: 1.5rem 0.75rem;
		border-radius: 0.25rem;
	}
	input[type='date']::-webkit-datetime-edit {
		line-height: 1.375rem;
	}
	.readonly .input,
	.input:focus {
		background: var(--colors-base);
		padding: 2.25rem 0.75rem 0.75rem;
		line-height: 1.5rem;
		font-size: 1rem;
	}
	.input:focus {
		border: 1px solid var(--colors-high);
		outline: none;
	}
	.readonly .input {
		border: 1px solid transparent;
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
	.readonly .input + label,
	.input:focus + .label {
		background: var(--colors-base);
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
	.helper-text {
		padding: 0.5rem 0.75rem;
	}
</style>
