<script lang="ts">
	let age = $state(18)
	let endAge = $state(80)
	interface Portfolio {
		apy: number
		feeSuccess: number
		feeMangement: number
	}
	let portfolio = $state<Portfolio>({ apy: 0, feeSuccess: 0, feeMangement: 0 })
    let deposits = $state([{}])
</script>

<div>
	<label for="age">
		Věk
		<input type="text" name="age" bind:value={age} />
	</label>
	<label for="apy">
		Věk při ukončení investic
		<input type="text" name="apy" bind:value={endAge} />
	</label>
	<label for="apy">
		Zhodnocení
		<input type="text" name="apy" bind:value={portfolio.apy} />
	</label>
	<label for="feeSuccess">
		Poplatek za úspěch
		<input type="text" name="feeSuccess" bind:value={portfolio.feeSuccess} />
	</label>
	<label for="feeMangement">
		Poplatek za správu
		<input type="text" name="feeMangement" bind:value={portfolio.feeMangement} />
	</label>
</div>
<div>
    <h3>Vklady</h3>
    <button>+</button>
    <h3>Výběry</h3>
    <button>+</button>
</div>
