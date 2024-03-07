<script lang="ts">
	import type { HTMLOptionAttributes } from 'svelte/elements'

	let { value } = $props<HTMLOptionAttributes>()
</script>

<option {value}><slot /></option>
