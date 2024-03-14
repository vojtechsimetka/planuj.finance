<script lang="ts">
	type Props = {
		errors: string[]
	}

	const { errors }: Props = $props()
</script>

{#if errors.length > 0}
	<ul>
		{#each errors as err}
			<li>{err}</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		margin: 0;
		padding: 0;
	}
</style>
