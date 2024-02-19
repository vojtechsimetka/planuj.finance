<script lang="ts">
	import type { Withdrawal } from '$lib/types'
	import { day, week, month, year } from '$lib/utils'
	interface Props {
		withdrawal: Withdrawal
	}
	let { withdrawal } = $props<Props>()

	$effect(() => {
		if (!withdrawal.isRecurring) {
			withdrawal.endDate = undefined
			withdrawal.frequency = undefined
		}
	})
</script>

<div>
	<label>
		Název
		<input type="text" bind:value={withdrawal.name} />
	</label>
	<label>
		Výše
		<input type="number" bind:value={withdrawal.amount} />
	</label>
	<label>
		Začátek
		<input type="date" bind:value={withdrawal.startDate} />
	</label>
	<label>
		Pravidelný výběr
		<input type="checkbox" bind:checked={withdrawal.isRecurring} />
	</label>
	{#if withdrawal.isRecurring}
		<label>
			Konec
			<input type="date" bind:value={withdrawal.endDate} />
		</label>
		<label>
			Frekvence
			<select bind:value={withdrawal.frequency}>
				<option value={day}>Denně</option>
				<option value={week}>Týdně</option>
				<option value={month}>Měsíčně</option>
				<option value={year}>Ročně</option>
			</select>
		</label>
	{/if}
	<slot />
</div>
