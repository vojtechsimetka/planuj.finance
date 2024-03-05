<script lang="ts">
	import { page } from '$app/stores'
	import DepositComponent from '$lib/components/deposit.svelte'
	import { detailStore } from '$lib/stores/details.svelte'
	import { goto } from '$app/navigation'
	import { get } from 'svelte/store'
	import { isInt, initializeForm } from '$lib/utils'
	import routes from '$lib/routes'
	import type { ZodError } from 'zod'
	import type { DepositForm } from '$lib/types'
	import { depositWithdrawalFormSchema, depositWithdrawalSchema } from '$lib/schemas'

	const index = get(page).params.id
	const depositIndex = isInt(index) ? Number.parseInt(index) : undefined

	let deposit = $state<DepositForm>(initializeForm(detailStore.deposits, depositIndex))
	let formValid = $state(false)
	let formErrors: ZodError | undefined = $state()

	$effect(() => {
		const res = depositWithdrawalFormSchema.safeParse(deposit)
		if (res.success) {
			formErrors = undefined
			formValid = true
		} else {
			formErrors = res.error
			formValid = false
		}
	})

	function save() {
		if (depositIndex !== undefined) {
			const res = depositWithdrawalSchema.safeParse(deposit)
			if (res.success) {
				detailStore.saveDeposit(depositIndex, res.data)
				goto(routes.HOME)
			}
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
		const res = depositWithdrawalSchema.safeParse(deposit)
		if (res.success) {
			detailStore.addDeposit(res.data)
			goto(routes.HOME)
		}
	}
</script>

{#if (depositIndex === undefined && Boolean(index)) || (depositIndex !== undefined && detailStore.deposits.length <= depositIndex)}
	<h1>Výběr s indexem {index} jsme nenalezli</h1>
	<a href="/">Zpět</a>
{:else if depositIndex !== undefined}
	<h1>Upravujete vklad {depositIndex}</h1>
	<DepositComponent bind:deposit />
	<button onclick={save} disabled={!formValid}>save</button>
	<button onclick={deleteDeposit}>delete</button>
	<button onclick={cancel}>cancel</button>
{:else}
	<h1>Nový vklad</h1>
	<DepositComponent bind:deposit />
	<button onclick={add} disabled={!formValid}>add</button>
{/if}
{#if formErrors}
	<pre>{JSON.stringify(formErrors, null, 2)}</pre>
{/if}
