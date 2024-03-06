<script lang="ts">
	import type { WithdrawalForm } from '$lib/types'
	import { _ } from 'svelte-i18n'

	interface Props {
		withdrawal: WithdrawalForm
	}
	let { withdrawal } = $props<Props>()
</script>

<div>
	<label>
		{$_('nameOfOperation')}
		<input type="text" bind:value={withdrawal.name} />
	</label>
	<label>
		{$_('amount')}
		<input type="number" bind:value={withdrawal.amount} />
	</label>
	<label>
		{$_('startDate')}
		<input type="date" bind:value={withdrawal.startDate} />
	</label>
	<label>
		{$_('isWithdrawalRecurring')}
		<input type="checkbox" bind:checked={withdrawal.isRecurring} />
	</label>
	{#if withdrawal.isRecurring}
		<label>
			{$_('endDate')}
			<input type="date" bind:value={withdrawal.endDate} />
		</label>
		<label>
			{$_('frequency')}
			<select bind:value={withdrawal.frequency}>
				<option value="day">{$_('daily')}</option>
				<option value="week">{$_('weekly')}</option>
				<option value="month">{$_('monthly')}</option>
				<option value="year">{$_('yearly')}</option>
			</select>
		</label>
	{/if}
	<slot />
</div>
