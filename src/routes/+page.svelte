<script lang="ts">
	import Chart from 'chart.js/auto'
	import { _ } from 'svelte-i18n'
	import { page } from '$app/stores'
	import routes from '$lib/routes'
	import { detailStore } from '$lib/stores/details.svelte'
	import { resultStore } from '$lib/stores/results.svelte'
	import { supportedCurrenciesWithLabels } from '$lib/types'
	import Language from '$lib/components/language.svelte'

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

		// detailStore.restoreFromUrl(newHash)

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

	let canvas: HTMLCanvasElement | null = $state(null)
	let chart: Chart | null = $state(null)

	$effect(() => {
		const getLabels = () => resultStore.graphData.map((row) => row.date.getFullYear())
		const getTotalInvested = () => resultStore.graphData.map((row) => row.totalInvested)
		const getTotalDeposited = () => resultStore.graphData.map((row) => row.totalDeposited)
		const getTotalWithdrawn = () => resultStore.graphData.map((row) => row.totalWithdrawn)
		const getTotalFees = () => resultStore.graphData.map((row) => row.totalFees)

		if (canvas && !chart) {
			chart = new Chart(canvas, {
				type: 'line',
				data: {
					labels: getLabels(),
					datasets: [
						{
							label: 'Invested value',
							data: getTotalInvested(),
							fill: {
								target: 'origin',
							},
						},
						{
							label: 'Deposited',
							data: getTotalDeposited(),
							fill: {
								target: 'origin',
							},
						},
						{
							label: 'Withdrawn',
							data: getTotalWithdrawn(),
							fill: {
								target: 'origin',
							},
						},
						{
							label: 'Deposit & Withdraw fees',
							data: getTotalFees(),
							fill: {
								target: 'origin',
							},
						},
					],
				},
				options: {
					scales: {
						y: {
							min: 0,
						},
					},
				},
			})
		}

		if (chart && resultStore.graphData) {
			chart.data.labels = getLabels()
			chart.data.datasets[0].data = getTotalInvested()
			chart.data.datasets[1].data = getTotalDeposited()
			chart.data.datasets[2].data = getTotalWithdrawn()
			chart.data.datasets[3].data = getTotalFees()
			chart.update()
		}
	})
</script>

{#if loading}
	Loading...
{:else}
	<div>
		<Language />
		<label>
			{$_('dateOfBirth')}
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
	<div class="chart">
		<canvas bind:this={canvas} />
	</div>
	<div>
		<h3>Výsledky</h3>
		Efektivní zhodnocení {(resultStore.effectiveApy * 100).toFixed(2)} % Věk klienta: {age}
		Celkové vklady: {resultStore.totalDeposited}
		Celkové výbery: {resultStore.totalWithdrawn}
		Poplatek za vklady: {resultStore.totalDepositFees}
		Poplatek za výběry: {resultStore.totalWithdrawFees}
	</div>
{/if}
