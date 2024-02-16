<script lang="ts">
	import { page } from '$app/stores'
	import { get } from 'svelte/store'
	import type { Withdrawal } from '$lib/types'
	import { detailStore } from '$lib/stores/details.svelte'
	import WithdrawalComponent from '$lib/components/withdrawal.svelte'
	import { goto } from '$app/navigation'

	let withdrawalIndex = get(page).params.id
	let withdrawal = $state<Withdrawal>(
		withdrawalIndex
			? { ...detailStore.withdrawals[Number.parseInt(withdrawalIndex)] }
			: undefined ?? {
					name: '',
					amount: 0,
					startDate: new Date(),
					frequency: 1,
				},
	)
</script>

{#if withdrawalIndex}
	<h1>Upravujete výběr {withdrawalIndex}</h1>
	<WithdrawalComponent bind:withdrawal />
	<button
		onclick={() => {
			detailStore.withdrawals[Number.parseInt(withdrawalIndex)] = withdrawal
			goto('/')
		}}>save</button
	>
	<button
		onclick={() => {
			detailStore.withdrawals.splice(Number.parseInt(withdrawalIndex), 1)
			goto('/')
		}}>delete</button
	>
	<button
		onclick={() => {
			goto('/')
		}}>cancel</button
	>
{:else}
	<h1>Nový výběr</h1>
	<WithdrawalComponent bind:withdrawal />
	<button
		onclick={() => {
			detailStore.withdrawals.push(withdrawal)
			goto('/')
		}}>add</button
	>
{/if}
