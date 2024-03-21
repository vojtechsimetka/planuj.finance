<script lang="ts">
	import type { Deposit, Withdrawal } from '$lib/types'
	import { _ } from 'svelte-i18n'
	import { detailStore } from '$lib/stores/details.svelte'
	import { year } from '$lib/utils'
	import { Warning } from 'carbon-icons-svelte'
	import { incrementDate } from '$lib/calc'

	interface Props {
		operation: Deposit | Withdrawal
		currency: Intl.NumberFormat
	}

	let { operation, currency }: Props = $props()
	function formatFrequency() {
		if (operation.isRecurring) {
			switch (operation.frequency) {
				case 'day':
					return ` / ${$_('day')}`
				case 'week':
					return ` / ${$_('week')}`
				case 'month':
					return ` / ${$_('month')}`
				case 'year':
					return ` / ${$_('year')}`
			}
		}
		return ''
	}
	let operationErrors: string[] = $derived.by(() => {
		const dateOfBirth = new Date(detailStore.dateOfBirth).getTime()
		const dateOfEndInvestment = incrementDate(
			detailStore.dateOfBirth,
			'year',
			detailStore.endAge,
		).getTime()
		const dateOfStartOperation = operation.startDate.getTime()
		const dateOfEndOperation = operation.isRecurring ? operation.endDate.getTime() : 0
		if (dateOfStartOperation < dateOfBirth && dateOfEndInvestment < dateOfEndOperation) {
			return [$_('operationBeforeBorn'), $_('operationAfterEnd')]
		} else if (dateOfStartOperation < dateOfBirth) {
			return [$_('operationBeforeBorn')]
		} else if (dateOfEndInvestment < dateOfEndOperation) {
			return [$_('operationAfterEnd')]
		} else {
			return []
		}
	})
</script>

<div>
	<div class="flex-container">
		<div class="info-of-operation">
			<p class="operation-name">{operation.name}</p>
			<p class="operation-amount">
				{currency.format(operation.amount)}&nbsp;{formatFrequency()}
			</p>
			<p class="operation-date">
				{operation.startDate.toLocaleDateString()}{operation.isRecurring
					? ' - ' + operation.endDate.toLocaleDateString()
					: ''}
			</p>
		</div>
		<div class="operation-icon">
			<slot />
		</div>
	</div>
	<div class="helper-text">
		{#if operationErrors.length > 0}
			{#each operationErrors as err}
				<div class="error">
					<Warning />&nbsp;{err}
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.flex-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0.75rem;
		gap: 0.5rem;
		justify-content: space-between;
		background: var(--colors-base);
		border-radius: 0.25rem;
	}
	.info-of-operation {
		display: flex;
		flex-direction: column;
	}
	p {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: Arial;
		font-style: normal;
		font-weight: 400;
		align-self: stretch;
	}
	.operation-name {
		color: var(--colors-high, #555);
		font-size: 0.75rem;
		line-height: 1rem;
		letter-spacing: 0.0375rem;
	}
	.operation-amount {
		color: var(--colors-ultraHigh, #303030);
		font-size: 1rem;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
		margin: 0.5rem 0;
	}
	.operation-date {
		color: var(--colors-ultraHigh, #303030);
		font-size: 0.75rem;
		line-height: 1.5rem;
		letter-spacing: 0.015rem;
	}
	.operation-icon {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}
	.helper-text {
		color: var(--colors-ultraHigh);
		font-family: Arial;
		font-size: 0.75rem;
		font-style: normal;
		font-weight: 400;
		line-height: 1rem;
		letter-spacing: 0.0375rem;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		padding: 0rem 0.75rem 0.5rem;
	}
	.error {
		display: inline-flex;
	}
</style>
