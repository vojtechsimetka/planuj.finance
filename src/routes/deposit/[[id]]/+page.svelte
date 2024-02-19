<script lang="ts">
	import { page } from '$app/stores'
	import type { Deposit } from '$lib/types'
	import DepositComponent from '$lib/components/deposit.svelte'
	import { detailStore } from '$lib/stores/details.svelte'
	import { goto } from '$app/navigation'
	import { get } from 'svelte/store'
	import { getElementFromArray, isInt } from '$lib/utils'
	import routes from '$lib/routes'

	const index = get(page).params.id
	const depositIndex = isInt(index) ? Number.parseInt(index) : undefined

	let deposit = $state<Deposit>(
		getElementFromArray(detailStore.deposits, depositIndex) ?? {
			name: '',
			amount: 0,
			startDate: new Date(),
			isRecurring: false,
		},
	)
	function save() {
		if (depositIndex !== undefined) {
			detailStore.saveDeposit(depositIndex, deposit)
			goto(routes.HOME)
		}
	}
	function deleteDeposit() {
		if (depositIndex !== undefined) {
			detailStore.removeDeposit(depositIndex)
			goto(routes.HOME)
		}
	}

	function cancel() {
		goto(routes.HOME)
	}

	function add() {
		detailStore.addDeposit(deposit)
		goto(routes.HOME)
	}
</script>

{#if (depositIndex === undefined && Boolean(index)) || (depositIndex !== undefined && detailStore.deposits.length <= depositIndex)}
	<h1>Výběr s indexem {index} jsme nenalezli</h1>
	<a href="/">Zpět</a>
{:else if depositIndex !== undefined}
	<h1>Upravujete vklad {depositIndex}</h1>
	<DepositComponent bind:deposit />
	<button onclick={save}>save</button>
	<button onclick={deleteDeposit}>delete</button>
	<button onclick={cancel}>cancel</button>
{:else}
	<h1>Nový vklad</h1>
	<DepositComponent bind:deposit />
	<button onclick={add}>add</button>
{/if}
