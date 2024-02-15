<script lang="ts">
	import { page } from '$app/stores'
	import type { Deposit } from '$lib/types'
	import DepositComponent from '$lib/components/deposit.svelte'
	import { detailStore } from '$lib/stores/details.svelte'
	import { goto } from '$app/navigation'
	import { get } from 'svelte/store'

	let depositIndex = get(page).params.id

	let deposit = $state<Deposit>(
		depositIndex
			? { ...detailStore.deposits[Number.parseInt(depositIndex)] }
			: undefined ?? {
					name: '',
					amount: 0,
					startDate: new Date(),
					frequency: 1,
				},
	)

	$inspect({ deposit, allDeposits: detailStore.deposits })
</script>

{#if depositIndex}
	<h1>Upravujete vklad {depositIndex}</h1>
	<DepositComponent bind:deposit />
	<button
		onclick={() => {
			detailStore.deposits[Number.parseInt(depositIndex)] = deposit
			goto('/')
		}}>save</button
	>
	<button
		onclick={() => {
			detailStore.deposits.splice(Number.parseInt(depositIndex), 1)
			goto('/')
		}}>delete</button
	>
	<button
		onclick={() => {
			goto('/')
		}}>cancel</button
	>
{:else}
	<h1>Nový vklad</h1>
	<DepositComponent bind:deposit />
	<button
		onclick={() => {
			detailStore.deposits.push(deposit)
			goto('/')
		}}>add</button
	>
{/if}
