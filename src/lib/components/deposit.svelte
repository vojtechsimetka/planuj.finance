<script lang="ts">
	import type { Deposit } from '$lib/types'
	import { day, week, month, year } from '$lib/utils'

	interface Props {
		deposit: Deposit
	}
	let { deposit } = $props<Props>()

	$effect(() => {
		if (!deposit.isRecurring) {
			deposit.endDate = undefined
			deposit.frequency = undefined
		}
	})
	$inspect(deposit.frequency)
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
		Pravidelný vklad
		<input type="checkbox" bind:checked={deposit.isRecurring} />
	</label>
	{#if deposit.isRecurring}
		<label>
			Konec
			<input type="date" bind:value={deposit.endDate} />
		</label>
		<label>
			Frekvence
			<select bind:value={deposit.frequency}>
				<option value={day}>Denně</option>
				<option value={week}>Týdně</option>
				<option value={month}>Měsíčně</option>
				<option value={year}>Ročně</option>
			</select>
		</label>
	{/if}
	<slot />
</div>
