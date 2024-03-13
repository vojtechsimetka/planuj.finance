<script lang="ts">
	import Chart from 'chart.js/auto'
	import { _ } from 'svelte-i18n'
	import { page } from '$app/stores'
	import routes from '$lib/routes'
	import { detailStore, type DetailsStoreValues } from '$lib/stores/details.svelte'
	import { resultStore } from '$lib/stores/results.svelte'
	import Language from '$lib/components/language.svelte'
	import Input from '$lib/components/input.svelte'
	import Select from '$lib/components/select.svelte'
	import Option from '$lib/components/option.svelte'
	import Operation from '$lib/components/operation.svelte'
	import { Edit, TrashCan } from 'carbon-icons-svelte'
	import Button from '$lib/components/button.svelte'
	import { supportedCurrenciesWithLabels } from '$lib/types'
	import { formatDate } from '$lib/utils'
	import { z } from 'zod'
	import { withFormStore, type FormStore } from '$lib/stores/form.svelte'
	import { dateOfBirthSchema, endAgeSchema, supportedCurrenciesSchema } from '$lib/schemas'
	import Error from '$lib/components/error.svelte'

	const initialValues = {
		dateOfBirth: formatDate(new Date()),
		endAge: 80,
		currency: 'CZK',
		inflation: 2,
		apy: 0,
		feeSuccess: 0,
		feeManagement: 0,
		entryFee: 0,
		withdrawalFee: 0,
	} as const

	let hash = $state('')
	let loading = $state<boolean>(true)
	let dateOfBirth = withFormStore(initialValues.dateOfBirth, dateOfBirthSchema)
	let endAge = withFormStore(initialValues.endAge, endAgeSchema)
	let currency = withFormStore(initialValues.currency, supportedCurrenciesSchema)
	let inflation = withFormStore(initialValues.inflation, z.number().nonnegative())
	let apy = withFormStore(initialValues.apy, z.number().nonnegative())
	let feeSuccess = withFormStore(initialValues.feeSuccess, z.number().nonnegative())
	let feeManagement = withFormStore(initialValues.feeManagement, z.number().nonnegative())
	let entryFee = withFormStore(initialValues.entryFee, z.number().nonnegative())
	let withdrawalFee = withFormStore(initialValues.withdrawalFee, z.number().nonnegative())

	function synchronize<T extends string | number | Date, V extends string | number | Date>(
		loading: boolean,
		form: FormStore<V, T>,
		store: DetailsStoreValues,
		key: keyof DetailsStoreValues,
	) {
		if (loading) return

		if (!form.edited) {
			const storeVal = store[key]
			if (storeVal instanceof Date) (form.value as string) = formatDate(storeVal)
			else (form.value as unknown) = storeVal as unknown
		} else if (
			form.parsedValue !== undefined &&
			((form.parsedValue instanceof Date &&
				store[key] instanceof Date &&
				form.parsedValue.getTime() !== (store[key] as Date).getTime()) ||
				form.parsedValue !== store[key])
		)
			(store[key] as unknown) = form.parsedValue
	}

	$effect(() => synchronize(loading, dateOfBirth, detailStore, 'dateOfBirth'))
	$effect(() => synchronize(loading, endAge, detailStore, 'endAge'))
	$effect(() => synchronize(loading, currency, detailStore, 'currency'))
	$effect(() => synchronize(loading, inflation, detailStore, 'inflation'))
	$effect(() => synchronize(loading, apy, detailStore, 'apy'))
	$effect(() => synchronize(loading, entryFee, detailStore, 'entryFee'))
	$effect(() => synchronize(loading, withdrawalFee, detailStore, 'withdrawalFee'))
	$effect(() => synchronize(loading, feeManagement, detailStore, 'feeManagement'))
	$effect(() => synchronize(loading, feeSuccess, detailStore, 'feeSuccess'))

	$effect(() => {
		const newHash = detailStore.toUrl()

		if (hash !== newHash) {
			hash = newHash
			window.location.hash = newHash
		}
	})

	page.subscribe(({ url }) => {
		if (!detailStore) return
		if (!url.hash) {
			loading = false
			return
		}

		let newHash = url.hash.slice(1)
		if (hash === newHash) return
		hash = newHash

		detailStore.restoreFromUrl(hash)

		setTimeout(() => {
			dateOfBirth.value = formatDate(detailStore.dateOfBirth)
			inflation.value = detailStore.inflation
			endAge.value = detailStore.endAge
			currency.value = detailStore.currency
			apy.value = detailStore.apy
			entryFee.value = detailStore.entryFee
			withdrawalFee.value = detailStore.withdrawalFee
			feeManagement.value = detailStore.feeManagement
			feeSuccess.value = detailStore.feeSuccess
			loading = false
		}, 0)
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
				bind:value={dateOfBirth.value}
			>
				<Error errors={dateOfBirth.error} />
			</Input>
			<Input type="number" labelFor="endAge" placeholder={$_('endAge')} bind:value={endAge.value}>
				<Error errors={endAge.error} />
			</Input>
		</div>
	</section>
	<section>
		<h5>{$_('portfolioInformations')}</h5>
		<div class="grid">
			<Input type="number" labelFor="apy" placeholder={$_('apy')} bind:value={apy.value}></Input>
			<Input
				type="number"
				labelFor="inflation"
				placeholder={$_('inflation')}
				bind:value={inflation.value}
			>
				<Error errors={inflation.error} />
			</Input>
			<Select value={currency.value} placeholder={$_('currency')}>
				{#each supportedCurrenciesWithLabels as currency}
					<Option value={currency.value}>{currency.label}</Option>
				{/each}
			</Select>
			<Input
				type="number"
				labelFor="entryFee"
				placeholder={$_('entryFee')}
				bind:value={entryFee.value}
			>
				<Error errors={entryFee.error} />
			</Input>
			<Input
				type="number"
				labelFor="inflation"
				placeholder={$_('withdrawalFee')}
				bind:value={withdrawalFee.value}
			>
				<Error errors={withdrawalFee.error} />
			</Input>
			<Input
				type="number"
				labelFor="feeManagement"
				placeholder={$_('feeMangement')}
				bind:value={feeManagement.value}
			>
				<Error errors={feeManagement.error} />
			</Input>
			<Input
				type="number"
				labelFor="feeSuccess"
				placeholder={$_('feeSuccess')}
				bind:value={feeSuccess.value}
			>
				<Error errors={feeSuccess.error} />
			</Input>
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
		<h5>{$_('results')}</h5>
		<div class="grid">
			<Input
				type={'text'}
				readonly
				placeholder={$_('effectiveEvaluation')}
				value={`${(resultStore.effectiveApy * 100).toFixed(2)} %`}
			></Input>
			<Input
				type={'text'}
				readonly
				placeholder={$_('totalDeposits')}
				value={`${resultStore.totalDeposited} ${detailStore.currency}`}
			></Input>
			<Input
				type={'text'}
				readonly
				placeholder={$_('totalWithdrawals')}
				value={`${resultStore.totalWithdrawn} ${detailStore.currency}`}
			></Input>
			<Input type={'text'} readonly placeholder={$_('clientAge')} value={age}></Input>
		</div>
		<h5>{$_('paidOnFees')}</h5>
		<div class="grid">
			<Input
				type={'text'}
				readonly
				placeholder={$_('entryFee')}
				value={`${resultStore.totalDepositFees} ${detailStore.currency}`}
			></Input>
			<Input
				type={'text'}
				readonly
				placeholder={$_('withdrawalFee')}
				value={`${resultStore.totalWithdrawFees} ${detailStore.currency}`}
			></Input>
			<Input type={'text'} readonly placeholder={$_('feeMangement')} value={'Total management fee'}
			></Input>
			<Input type={'text'} readonly placeholder={$_('feeSuccess')} value={'Total success fee'}
			></Input>
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
		grid-template-columns: repeat(auto-fill, minmax(16.5rem, 1fr));
		gap: 1rem;
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
