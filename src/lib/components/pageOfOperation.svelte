<script lang="ts">
	import type { DepositForm, WithdrawalForm } from '$lib/types'
	import { _ } from 'svelte-i18n'
	import Toggle from './toggle.svelte'
	import Input from '$lib/components/input.svelte'
	import Select from './select.svelte'
	import Option from './option.svelte'

	interface Props {
		operation: DepositForm | WithdrawalForm
	}
	let { operation } = $props<Props>()
</script>

<section>
	<div class="grid">
		<Input type="text" bind:value={operation.name} placeholder={$_('nameOfOperation')}></Input>
		<Input type="number" bind:value={operation.amount} placeholder={$_('amount')}></Input>
		<Input type="date" bind:value={operation.startDate} placeholder={$_('startDate')}></Input>
	</div>
	<Toggle bind:checked={operation.isRecurring}>{$_('isDepositRecurring')}</Toggle>
	{#if operation.isRecurring}
		<div class="grid">
			<Input type="date" bind:value={operation.endDate} placeholder={$_('endDate')}></Input>
			<Select bind:value={operation.frequency} placeholder={$_('frequency')}>
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
