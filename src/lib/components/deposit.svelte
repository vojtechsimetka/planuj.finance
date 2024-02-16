<script lang="ts">
	import type { Deposit } from '$lib/types'

	interface Props {
		deposit: Deposit
	}
	let { deposit } = $props<Props>()
</script>

<div>
	<label>
		Název
		<input type="text" bind:value={deposit.name} />
	</label>
	<label>
		Výše
		<input type="number" bind:value={deposit.amount} />
	</label>
	<label>
		Začátek
		<input type="date" bind:value={deposit.startDate} />
	</label>
	<label>
		Konec
		<input type="date" bind:value={deposit.endDate} />
	</label>
	<label>
		Frekvence
		<input type="number" bind:value={deposit.frequency} />
	</label>
	<slot />
</div>
