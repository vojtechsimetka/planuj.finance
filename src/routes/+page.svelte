<script lang="ts">
	let age = $state(18)
	let endAge = $state(80)
	interface Portfolio {
		apy: number
		feeSuccess: number
		feeMangement: number
	}
	let portfolio = $state<Portfolio>({ apy: 0, feeSuccess: 0, feeMangement: 0 })
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
	<button>+</button>
	<h3>Výběry</h3>
	<button>+</button>
</div>
