<script lang="ts">
	import type { HTMLOptionAttributes } from 'svelte/elements'

	let { value } = $props<HTMLOptionAttributes>()
</script>

<option {value}><slot /></option>

<style>
	option {
		color: var(--colors-ultraHigh, #303030);
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1.5rem; /* 150% */
		letter-spacing: 0.02rem;
		padding: 0.5rem 1.5rem;
	}
	option:hover {
		background-color: var(--colors-low);
		cursor: pointer;
	}
</style>
