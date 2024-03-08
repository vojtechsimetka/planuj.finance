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
	import Select from '$lib/components/select.svelte'
	import Option from '$lib/components/option.svelte'
	import Operation from '$lib/components/operation.svelte'
	import { Edit, TrashCan } from 'carbon-icons-svelte'
	import Button from '$lib/components/button.svelte'

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
	<section>
		<div class="flex">
			<h5>{$_('clientInformations')}</h5>
			<Language />
		</div>
		<div class="grid">
			<Input
				type="date"
				labelFor="dateOfBirth"
				placeholder={$_('dateOfBirth')}
				bind:value={detailStore.dateOfBirth}
			></Input>
			<Input
				type="number"
				labelFor="endAge"
				placeholder={$_('endAge')}
				bind:value={detailStore.endAge}
			></Input>
		</div>
	</section>
	<section>
		<h5>{$_('portfolioInformations')}</h5>
		<div class="grid">
			<Input
				type="number"
				labelFor="apy"
				placeholder={$_('apy')}
				bind:value={detailStore.portfolio.apy}
			></Input>
			<Input
				type="number"
				labelFor="inflation"
				placeholder={$_('inflation')}
				bind:value={detailStore.inflation}
			></Input>
			<Select bind:value={detailStore.currency} placeholder={$_('currency')}>
				#{#each supportedCurrenciesWithLabels as currency}
					<Option value={currency.value}>{currency.label}</Option>
				{/each}
			</Select>
			<Input
				type="number"
				labelFor="entryFee"
				placeholder={$_('entryFee')}
				bind:value={detailStore.portfolio.entryFee}
			></Input>
			<Input
				type="number"
				labelFor="inflation"
				placeholder={$_('withdrawalFee')}
				bind:value={detailStore.portfolio.withdrawalFee}
			></Input>
			<Input
				type="number"
				labelFor="feeMangement"
				placeholder={$_('feeMangement')}
				bind:value={detailStore.portfolio.feeMangement}
			></Input>
			<Input
				type="number"
				labelFor="feeSuccess"
				placeholder={$_('feeSuccess')}
				bind:value={detailStore.portfolio.feeSuccess}
			></Input>
		</div>
	</section>
	<section>
		<div class="flex-add-deposit">
			<h5>{$_('plannedDeposits')}</h5>
			<a href={routes.DEPOSIT()}>+</a>
		</div>
		<div class="grid">
			{#each detailStore.deposits as deposit, i}
				<Operation operation={deposit} currency={detailStore.currency}>
					<div class="edit"><a href={routes.DEPOSIT(i)}><Edit size={24} /></a></div>
					<Button variant={'ghost'} onclick={() => detailStore.removeDeposit(i)}
						><TrashCan size={24} /></Button
					>
				</Operation>
			{/each}
		</div>
	</section>
	<section>
		<div class="flex-add-deposit">
			<h5>{$_('plannedWithdrawals')}</h5>
			<a href={routes.WITHDRAWAL()}>+</a>
		</div>
		<div class="grid">
			{#each detailStore.withdrawals as withdrawal, i}
				<Operation operation={withdrawal} currency={detailStore.currency}>
					<div class="edit"><a href={routes.WITHDRAWAL(i)}><Edit size={24} /></a></div>
					<Button variant={'ghost'} onclick={() => detailStore.removeWithdrawal(i)}
						><TrashCan size={24} /></Button
					>
				</Operation>
			{/each}
		</div>
	</section>
	<section>
		<div class="chart">
			<canvas bind:this={canvas} />
		</div>
	</section>
	<section>
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
	</section>
{/if}

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: Arial, Helvetica, sans-serif;
	}
	html {
		max-width: 1200px;
		padding: 0 auto;
	}
	body {
		padding: 1rem;
	}
	section {
		padding-bottom: 1rem;
		max-width: 1200px;
		margin: 0 auto;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 2rem;
		justify-content: center;
		width: 100%;
	}
	.flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.flex-add-deposit {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		position: relative;
	}
	.flex-add-deposit > a {
		position: absolute;
		top: 0;
		left: 13rem;
	}
	h5 {
		color: var(--colors-ultraHigh, #303030);
		/* h5 */
		font-family: Arial;
		font-size: 1rem;
		font-style: normal;
		font-weight: 700;
		line-height: 1.5rem;
		letter-spacing: 0.02rem;
	}
	.edit > a {
		display: inline-flex;
		padding: 12px;
		justify-content: center;
		align-items: center;
		text-decoration: none;
		background: transparent;
		color: var(--colors-ultraHigh);
	}
	.edit > a:active {
		background: var(--colors-low);
		color: var(--colors-high);
	}
</style>
