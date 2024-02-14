<script lang="ts">
	let age = $state(18)
	interface Portfolio {
		apy: number
		feeSuccess: number
		feeMangement: number
	}
	let portfolio = $state<Portfolio>({ apy: 0, feeSuccess: 0, feeMangement: 0 })
</script>

<div>
	<label for="age">
		<input type="text" name="age" bind:value={age} />
	</label>
	{age}
	<label for="apy">
		<input type="text" name="apy" bind:value={portfolio.apy} />
	</label>
</div>
