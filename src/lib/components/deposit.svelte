<script lang="ts">
	import type { Deposit } from '$lib/types'

	interface Props {
		deposit: Deposit
		deleteDeposit: () => void
	}
	let { deposit, deleteDeposit } = $props<Props>()
</script>

<div>
	<label>
		Název
		<input type="text" bind:value={deposit.name} />
	</label>
	<label>
		Výše
		<input type="text" bind:value={deposit.amount} />
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
		<input type="text" bind:value={deposit.frequency} />
	</label>
	<button onclick={deleteDeposit}>delete</button>
</div>
