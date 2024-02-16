<script lang="ts">
	import type { Withdrawal } from '$lib/types'

	interface Props {
		withdrawal: Withdrawal
	}
	let { withdrawal } = $props<Props>()
</script>

<div>
	<label>
		Název
		<input type="text" bind:value={withdrawal.name} />
	</label>
	<label>
		Výše
		<input type="text" bind:value={withdrawal.amount} />
	</label>
	<label>
		Začátek
		<input type="date" bind:value={withdrawal.startDate} />
	</label>
	<label>
		Konec
		<input type="date" bind:value={withdrawal.endDate} />
	</label>
	<label>
		Frekvence
		<input type="text" bind:value={withdrawal.frequency} />
	</label>
	<slot />
</div>
