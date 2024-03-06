<script lang="ts">
	import Chart from 'chart.js/auto'
	import { _ } from 'svelte-i18n'
	import { page } from '$app/stores'
	import routes from '$lib/routes'
	import { detailStore } from '$lib/stores/details.svelte'
	import { resultStore } from '$lib/stores/results.svelte'
	import { supportedCurrenciesWithLabels } from '$lib/types'
	import Language from '$lib/components/language.svelte'
	import Input from '$lib/components/input.svelte'

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
			{$_('endAge')}
			<input type="number" bind:value={detailStore.endAge} />
		</label>
		<label>
			{$_('currency')}
			<select bind:value={detailStore.currency}>
				{#each supportedCurrenciesWithLabels as currency}
					<option value={currency.value}>{currency.label}</option>
				{/each}
			</select>
		</label>
		<label>
			{$_('inflation')}
			<input type="number" bind:value={detailStore.inflation} />
		</label>
		<label>
			{$_('apy')}
			<input type="number" bind:value={detailStore.portfolio.apy} />
		</label>
		<label>
			{$_('feeSuccess')}
			<input type="number" bind:value={detailStore.portfolio.feeSuccess} />
		</label>
		<label>
			{$_('feeMangement')}
			<input type="number" bind:value={detailStore.portfolio.feeMangement} />
		</label>
		<label>
			{$_('entryFee')}
			<input type="number" bind:value={detailStore.portfolio.entryFee} />
		</label>
		<label>
			{$_('withdrawalFee')}
			<input type="number" bind:value={detailStore.portfolio.withdrawalFee} />
		</label>
	</div>
	<div>
		<h3>{$_('deposits')}</h3>
		<a href={routes.DEPOSIT()}>+</a>
		{#each detailStore.deposits as deposit, i}
			<div>
				{JSON.stringify(deposit)}<a href={routes.DEPOSIT(i)}>{$_('edit')}</a><button
					onclick={() => detailStore.removeDeposit(i)}>{$_('delete')}</button
				>
			</div>
		{/each}
		<h3>{$_('withdrawals')}</h3>
		<a href={routes.WITHDRAWAL()}>+</a>
		{#each detailStore.withdrawals as withdrawal, i}
			<div>
				{JSON.stringify(withdrawal)}<a href={routes.WITHDRAWAL(i)}>{$_('edit')}</a><button
					onclick={() => detailStore.removeWithdrawal(i)}>{$_('delete')}</button
				>
			</div>
		{/each}
	</div>
	<div class="chart">
		<canvas bind:this={canvas} />
	</div>
	<div>
		<h3>{$_('results')}</h3>
		{$_('effectiveEvaluation')}
		{(resultStore.effectiveApy * 100).toFixed(2)} %
		{$_('clientAge')}
		{age}
		{$_('totalDeposits')}
		{resultStore.totalDeposited}
		{$_('totalWithdrawals')}
		{resultStore.totalWithdrawn}
		{$_('totalDepositsFee')}
		{resultStore.totalDepositFees}
		{$_('totalWithdrawalsFee')}
		{resultStore.totalWithdrawFees}
	</div>
{/if}
<Input type="number" labelFor="endDate" placeholder="End of investment">Error text</Input>
