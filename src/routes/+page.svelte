<script lang="ts">
	import DepositComponent from '$lib/components/deposit.svelte'
	import type { Deposit } from '$lib/types'

	let age = $state(18)
	let endAge = $state(80)

	interface Portfolio {
		apy: number
		feeSuccess: number
		feeMangement: number
	}
	let portfolio = $state<Portfolio>({ apy: 0, feeSuccess: 0, feeMangement: 0 })

	let deposits = $state<Deposit[]>([])
</script>

<div>
	<label>
		Věk
		<input type="text" bind:value={age} />
	</label>
	<label>
		Věk při ukončení investic
		<input type="text" bind:value={endAge} />
	</label>
	<label>
		Zhodnocení
		<input type="text" bind:value={portfolio.apy} />
	</label>
	<label>
		Poplatek za úspěch
		<input type="text" bind:value={portfolio.feeSuccess} />
	</label>
	<label>
		Poplatek za správu
		<input type="text" bind:value={portfolio.feeMangement} />
	</label>
</div>
<div>
	<h3>Vklady</h3>
	<button
		onclick={() => {
			deposits.push({
				name: `Deposit #${deposits.length}`,
				amount: Math.floor(Math.random() * 50) * 1000,
				startDate: new Date(),
				frequency: 1,
			})
		}}>+</button
	>
	{#each deposits as deposit, i}
		<DepositComponent {deposit} deleteDeposit={() => deposits.splice(i, 1)} />
	{/each}
	<h3>Výběry</h3>
	<button>+</button>
</div>
