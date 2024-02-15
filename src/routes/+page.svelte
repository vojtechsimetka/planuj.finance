<script lang="ts">
	import { detailStore } from '$lib/stores/details.svelte'
</script>

<div>
	<label>
		Věk
		<input type="text" bind:value={detailStore.age} />
	</label>
	<label>
		Věk při ukončení investic
		<input type="text" bind:value={detailStore.endAge} />
	</label>
	<label>
		Zhodnocení
		<input type="text" bind:value={detailStore.portfolio.apy} />
	</label>
	<label>
		Poplatek za úspěch
		<input type="text" bind:value={detailStore.portfolio.feeSuccess} />
	</label>
	<label>
		Poplatek za správu
		<input type="text" bind:value={detailStore.portfolio.feeMangement} />
	</label>
</div>
<div>
	<h3>Vklady</h3>
	<a href="/deposit">+</a>
	{#each detailStore.deposits as deposit, i}
		<div>{JSON.stringify(deposit)}<a href="/deposit/{i}">edit</a></div>
	{/each}
	<h3>Výběry</h3>
	<button>+</button>
</div>
