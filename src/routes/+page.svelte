<script lang="ts">
	import { page } from '$app/stores'
	import routes from '$lib/routes'
	import { detailStore } from '$lib/stores/details.svelte'
	import { resultStore } from '$lib/stores/results.svelte'
	import { supportedCurrenciesWithLabels } from '$lib/types'

	let oldHash = $state('')
	let loading = $state(true)

	$effect(() => {
		const hash = detailStore.toUrl()

		if (window.location.hash !== hash) {
			oldHash = hash
			window.location.hash = hash
		}
	})

	page.subscribe(({ url }) => {
		if (!detailStore) return
		if (!url.hash) {
			loading = false
			return
		}

		let newHash = url.hash.slice(1)
		if (oldHash === newHash) return

		detailStore.restoreFromUrl(newHash)

		oldHash = newHash

		setTimeout(() => (loading = false), 0)
	})

	function calculateAge(dateOfBirth: Date) {
		const today = new Date()
		let age = today.getFullYear() - dateOfBirth.getFullYear()
		const m = today.getMonth() - dateOfBirth.getMonth()

		// The birthday hasn't occurred yet this year
		if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) return age - 1
		return age
	}

	let age = $derived.by(() => calculateAge(new Date(detailStore.dateOfBirth)))
</script>

{#if loading}
	Loading...
{:else}
	<div>
		<label>
			Datum narození
			<input type="date" bind:value={detailStore.dateOfBirth} />
		</label>
		<label>
			Věk při ukončení investic
			<input type="number" bind:value={detailStore.endAge} />
		</label>
		<label>
			Měna
			<select bind:value={detailStore.currency}>
				{#each supportedCurrenciesWithLabels as currency}
					<option value={currency.value}>{currency.label}</option>
				{/each}
			</select>
		</label>
		<label>
			inflace
			<input type="number" bind:value={detailStore.inflation} />
		</label>
		<label>
			Zhodnocení
			<input type="number" bind:value={detailStore.portfolio.apy} />
		</label>
		<label>
			Poplatek za úspěch
			<input type="number" bind:value={detailStore.portfolio.feeSuccess} />
		</label>
		<label>
			Poplatek za správu
			<input type="number" bind:value={detailStore.portfolio.feeMangement} />
		</label>
		<label>
			Vstupní poplatek
			<input type="number" bind:value={detailStore.portfolio.entryFee} />
		</label>
		<label>
			Poplatek za výběr
			<input type="number" bind:value={detailStore.portfolio.withdrawalFee} />
		</label>
	</div>
	<div>
		<h3>Vklady</h3>
		<a href={routes.DEPOSIT()}>+</a>
		{#each detailStore.deposits as deposit, i}
			<div>
				{JSON.stringify(deposit)}<a href={routes.DEPOSIT(i)}>edit</a><button
					onclick={() => detailStore.removeDeposit(i)}>delete</button
				>
			</div>
		{/each}
		<h3>Výběry</h3>
		<a href={routes.WITHDRAWAL()}>+</a>
		{#each detailStore.withdrawals as withdrawal, i}
			<div>
				{JSON.stringify(withdrawal)}<a href={routes.WITHDRAWAL(i)}>edit</a><button
					onclick={() => detailStore.removeWithdrawal(i)}>delete</button
				>
			</div>
		{/each}
	</div>
	<div>
		<h3>Výsledky</h3>
		Efektivní zhodnocení {(resultStore.effectiveApy * 100).toFixed(2)} % Věk klienta: {age}
		Celkové vklady: {resultStore.totalDeposited}
		Celkové vklady: {resultStore.totalWithdrawn}
	</div>
{/if}
