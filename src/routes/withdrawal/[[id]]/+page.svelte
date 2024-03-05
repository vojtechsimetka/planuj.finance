<script lang="ts">
	import { page } from '$app/stores'
	import { get } from 'svelte/store'
	import type { WithdrawalForm } from '$lib/types'
	import { detailStore } from '$lib/stores/details.svelte'
	import WithdrawalComponent from '$lib/components/withdrawal.svelte'
	import { goto } from '$app/navigation'
	import { initializeForm, isInt } from '$lib/utils'
	import routes from '$lib/routes'
	import { depositWithdrawalFormSchema, depositWithdrawalSchema } from '$lib/schemas'
	import type { ZodError } from 'zod'

	const index = get(page).params.id
	const withdrawalIndex = isInt(index) ? Number.parseInt(index) : undefined

	let withdrawal = $state<WithdrawalForm>(initializeForm(detailStore.withdrawals, withdrawalIndex))
	let formValid = $state(false)
	let formErrors: ZodError | undefined = $state()

	$effect(() => {
		const res = depositWithdrawalFormSchema.safeParse(withdrawal)
		if (res.success) {
			formErrors = undefined
			formValid = true
		} else {
			formErrors = res.error
			formValid = false
		}
	})

	function save() {
		if (withdrawalIndex !== undefined) {
			const res = depositWithdrawalSchema.safeParse(withdrawal)
			if (res.success) {
				detailStore.saveWithdrawal(withdrawalIndex, res.data)
				goto(routes.HOME)
			}
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
		const res = depositWithdrawalSchema.safeParse(withdrawal)
		if (res.success) {
			detailStore.addWithdrawal(res.data)
			goto(routes.HOME)
		}
	}
</script>

{#if (withdrawalIndex === undefined && Boolean(index)) || (withdrawalIndex !== undefined && detailStore.withdrawals.length <= withdrawalIndex)}
	<h1>Výběr s indexem {index} jsme nenalezli</h1>
	<a href="/">Zpět</a>
{:else if withdrawalIndex !== undefined}
	<h1>Upravujete výběr {withdrawalIndex}</h1>
	<WithdrawalComponent bind:withdrawal />
	<button onclick={save} disabled={!formValid}>save</button>
	<button onclick={deleteWithdrawal}>delete</button>
	<button onclick={cancel}>cancel</button>
{:else}
	<h1>Nový výběr</h1>
	<WithdrawalComponent bind:withdrawal />
	<button onclick={add} disabled={!formValid}>add</button>
{/if}
{#if formErrors}
	<pre>{JSON.stringify(formErrors, null, 2)}</pre>
{/if}
