<script>
	// name = "TeamTabContent";
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Add from '../../../../assets/svg/add-main.svg';
	import Badge from '../../../../components/Badges/Badge.svelte';
	import Button from '../../../../components/Button/Button.svelte';

	$: items = [];
	$: result = [];
	async function getData() {
		const response = await fetch('http://localhost:8080/api/protected/listAllVenues', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include' // Include cookies in the request
		});

		if (response.ok) {
			result = await response.json();
			let tableData = [];
			result.forEach((result) => {
				tableData.push({
					id: result.ID,
					name: result.name,
					address: result.address,
					email: result.email,
					description: result.description,
					instagram: result.instagram,
					facebook: result.facebook,
					phone: result.phone,
					twitter: result.twitter,
					stageCount: result.stages.length,
					nextEvent: result.nextEvent,
					image: result.image
				});
			});
			items = tableData;
		} else {
			result = 'failure';
		}
	}

	onMount(async () => {
		getData();
	});
</script>

<div>
	<div class="w-full p-2 flex justify-end">
		<a href="/operator/venues/new">
			<Button className="w-full md:w-auto" beforeIcon={Add}>Add Venue</Button>
		</a>
	</div>

	<Table hoverable={true} {items}>
		<TableHead>
			<TableHeadCell>Venue</TableHeadCell>
			<TableHeadCell sort={(a, b) => a.type.localeCompare(b.type)}>Location</TableHeadCell>
			<TableHeadCell sort={(a, b) => a.make - b.make} defaultDirection="desc">Stages</TableHeadCell>
			<TableHeadCell sort={(a, b) => a.make - b.make} defaultDirection="desc"
				>Next event</TableHeadCell
			>
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each items as venue}
				<TableBodyRow
					slot="row"
					on:click={() => {
						window.location.href = `/operator/venues/${venue.id}/edit`;
					}}
				>
					<TableBodyCell>{venue.name}</TableBodyCell>
					<TableBodyCell>{venue.address}</TableBodyCell>
					<TableBodyCell>{venue.stageCount}</TableBodyCell>
					<TableBodyCell>
						<Badge size="large" status="success">Feb 1, 2024</Badge>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
