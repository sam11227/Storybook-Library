<script>
	// name = "TeamTabContent";
	import { onMount } from 'svelte';

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
	<div class="w-full p-2 flex">
		<span>Copy the below code into your web page to embed the Public Event Calendar.</span>
	</div>

	{#each items as venue}
		<h3>{venue.name}</h3>
		<textarea id="embed-code" readonly rows="4" cols="50" aria-label="Embed Code">
			&lt;script async src="https://ticketing.get-micdrop.com/embed/{venue.id}" title="{venue.name} Ticketing
			Embed View"&gt;&lt;/script&gt;
		</textarea>
	{/each}
</div>

<style>
	#embed-code {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: monospace;
		background-color: #f9f9f9;
	}
</style>
