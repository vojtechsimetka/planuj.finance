<script lang="ts">
	import type { WithdrawalForm } from '$lib/types'
	import { _ } from 'svelte-i18n'
	import Toggle from './toggle.svelte'
	import Input from '$lib/components/input.svelte'
	import Select from './select.svelte'
	import Option from './option.svelte'

	interface Props {
		withdrawal: WithdrawalForm
	}
	let { withdrawal } = $props<Props>()
</script>

<section>
	<div class="grid">
		<Input type="text" bind:value={withdrawal.name} placeholder={$_('nameOfOperation')}></Input>
		<Input type="number" bind:value={withdrawal.amount} placeholder={$_('amount')}></Input>
		<Input type="date" bind:value={withdrawal.startDate} placeholder={$_('startDate')}></Input>
	</div>
	<Toggle bind:checked={withdrawal.isRecurring}>{$_('isWithdrawalRecurring')}</Toggle>
	{#if withdrawal.isRecurring}
		<div class="grid">
			<Input type="date" bind:value={withdrawal.endDate} placeholder={$_('endDate')}></Input>
			<Select bind:value={withdrawal.frequency} placeholder={$_('frequency')}>
				<Option value="day">{$_('daily')}</Option>
				<Option value="week">{$_('weekly')}</Option>
				<Option value="month">{$_('monthly')}</Option>
				<Option value="year">{$_('yearly')}</Option>
			</Select>
		</div>
	{/if}
	<slot />
</section>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: Arial, Helvetica, sans-serif;
	}
	html {
		max-width: 1200px;
		padding: 0 auto;
	}
	body {
		padding: 1rem;
	}
	section {
		padding-bottom: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr));
		gap: 1rem;
		justify-content: center;
		width: 100%;
	}
</style>
