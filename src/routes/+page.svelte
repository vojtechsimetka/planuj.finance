<script lang="ts">
	import routes from '$lib/routes'
	import { detailStore } from '$lib/stores/details.svelte'
	import { resultStore } from '$lib/stores/results.svelte'
</script>

<div>
	<label>
		Věk
		<input type="number" bind:value={detailStore.age} />
	</label>
	<label>
		Věk při ukončení investic
		<input type="number" bind:value={detailStore.endAge} />
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
	Efektivní zhodnocení {(resultStore.effectiveApy * 100).toFixed(2)} %
</div>
