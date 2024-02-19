<script lang="ts">
	import { page } from '$app/stores'
	import { get } from 'svelte/store'
	import type { Withdrawal } from '$lib/types'
	import { detailStore } from '$lib/stores/details.svelte'
	import WithdrawalComponent from '$lib/components/withdrawal.svelte'
	import { goto } from '$app/navigation'
	import { getElementFromArray, isInt } from '$lib/utils'
	import routes from '$lib/routes'

	const index = get(page).params.id
	const withdrawalIndex = isInt(index) ? Number.parseInt(index) : undefined

	let withdrawal = $state<Withdrawal>(
		getElementFromArray(detailStore.withdrawals, withdrawalIndex) ?? {
			name: '',
			amount: 0,
			startDate: new Date(),
			isRecurring: false,
		},
	)

	function save() {
		if (withdrawalIndex !== undefined) {
			detailStore.saveWithdrawal(withdrawalIndex, withdrawal)
			goto(routes.HOME)
		}
	}

	function deleteWithdrawal() {
		if (withdrawalIndex !== undefined) {
			detailStore.removeWithdrawal(withdrawalIndex)
			goto(routes.HOME)
		}
	}

	function cancel() {
		goto(routes.HOME)
	}

	function add() {
		detailStore.addWithdrawal(withdrawal)
		goto(routes.HOME)
	}
</script>

{#if (withdrawalIndex === undefined && Boolean(index)) || (withdrawalIndex !== undefined && detailStore.withdrawals.length <= withdrawalIndex)}
	<h1>Výběr s indexem {index} jsme nenalezli</h1>
	<a href="/">Zpět</a>
{:else if withdrawalIndex !== undefined}
	<h1>Upravujete výběr {withdrawalIndex}</h1>
	<WithdrawalComponent bind:withdrawal />
	<button onclick={save}>save</button>
	<button onclick={deleteWithdrawal}>delete</button>
	<button onclick={cancel}>cancel</button>
{:else}
	<h1>Nový výběr</h1>
	<WithdrawalComponent bind:withdrawal />
	<button onclick={add}>add</button>
{/if}
