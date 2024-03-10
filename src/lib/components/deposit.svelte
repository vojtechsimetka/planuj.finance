<script lang="ts">
	import type { DepositForm } from '$lib/types'
	import { _ } from 'svelte-i18n'
	import Switch from './switch.svelte'

	interface Props {
		deposit: DepositForm
	}
	let { deposit } = $props<Props>()
</script>

<div>
	<label>
		{$_('nameOfOperation')}
		<input type="text" bind:value={deposit.name} />
	</label>
	<label>
		{$_('amount')}
		<input type="number" bind:value={deposit.amount} />
	</label>
	<label>
		{$_('startDate')}
		<input type="date" bind:value={deposit.startDate} />
	</label>
	<Switch bind:checked={deposit.isRecurring}>{$_('isDepositRecurring')}</Switch>
	{#if deposit.isRecurring}
		<label>
			{$_('endDate')}
			<input type="date" bind:value={deposit.endDate} />
		</label>
		<label>
			{$_('frequency')}
			<select bind:value={deposit.frequency}>
				<option value="day">{$_('daily')}</option>
				<option value="week">{$_('weekly')}</option>
				<option value="month">{$_('monthly')}</option>
				<option value="year">{$_('yearly')}</option>
			</select>
		</label>
	{/if}
	<slot />
</div>

<style>
</style>
