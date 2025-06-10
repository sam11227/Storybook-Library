<script>
	// name = "TeamTabContent";
	import { Button, Input, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let confirmStripeAccount = '';

	$: tokenObjects = [];
	$: result = [];
	$: newToken = '';
	$: defaultDescription =
		tokenObjects.length === 0 ? 'Stripe Account' : `Stripe Account ${tokenObjects.length + 1}`;
	let newDescription = defaultDescription; // Preserve user input
	$: errorMessage = '';
	async function getData() {
		const response = await fetch('http://localhost:8080/api/protected/stripe-connections', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include' // Include cookies in the request
		});

		if (response.ok) {
			result = await response.json();
			tokenObjects = result;
			console.log('wtf tokenObjects', tokenObjects);
			defaultDescription =
				tokenObjects.length === 0 ? 'Stripe Account' : `Stripe Account ${tokenObjects.length + 1}`;
			newDescription = newDescription || defaultDescription;
		} else {
			tokenObjects = [];
		}
	}
	$: newConnectedAccountId = '';
	async function createStripeAccount() {
		if (tokenObjects.some((token) => token.description === newDescription)) {
			errorMessage = 'Description must be unique.';
			return;
		}
		const response = await fetch('http://localhost:8080/api/protected/stripeAccount', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			body: JSON.stringify({ description: newDescription }),
			credentials: 'include' // Include cookies in the request
		});

		if (response.ok) {
			result = await response.json();
			console.log('stripeAccountPost result', result);
			newConnectedAccountId = result.account;
			getData();
			errorMessage = ''; // Clear error message on success
		} else {
			tokenObjects = [];
		}
	}
	$: sendToURL = '';
	$: sendToError = '';
	async function createStripeAccountLink(linkID) {
		const response = await fetch('http://localhost:8080/api/protected/stripeAccountLink', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			body: JSON.stringify({
				account: linkID
			}),
			credentials: 'include' // Include cookies in the request
		});

		if (response.ok) {
			result = await response.json();
			console.log('stripeAccountLinkPost result', result);
			sendToURL = result.url;
			sendToError = result.error;

			// Navigate to the URL
			if (sendToURL) {
				window.location.href = sendToURL;
			}
		} else {
			tokenObjects = [];
		}
	}
	async function putStripeConnection() {
		const response = await fetch(
			'http://localhost:8080/api/protected/stripe-connections/' + confirmStripeAccount,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include',
				body: JSON.stringify({
					token: confirmStripeAccount,
					linked: true
				})
			}
		);

		if (response.ok) {
			result = await response.json();

			window.location.href = '/operator/settings?activeTab=Billing';
		} else {
		}
	}
	async function makeDefaultStripeConnection(id) {
		const response = await fetch(
			'http://localhost:8080/api/protected/default-stripe-connections/' + id,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include'
			}
		);

		if (response.ok) {
			result = await response.json();

			window.location.href = '/operator/settings?activeTab=Billing';
		} else {
		}
	}
	async function deleteStripeConnection(id) {
		const response = await fetch('http://localhost:8080/api/protected/stripe-connections/' + id, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include'
		});

		if (response.ok) {
			result = await response.json();

			window.location.href = '/operator/settings?activeTab=Billing';
		} else {
		}
	}

	onMount(async () => {
		console.log('confirmStripeAccountLink:', confirmStripeAccount);
		if (confirmStripeAccount.startsWith('acct_')) {
			putStripeConnection();
		}
		getData();
	});
</script>

<div>
	<h2>Create a new Stripe connection</h2>
	<div class="grid grid-cols-4 gap-4 items-center border p-4 rounded">
		<div>
			<Label for="description" class="block mb-2">Description</Label>
			<Input id="description" size="lg" bind:value={newDescription} class="w-full" />
			{#if errorMessage}
				<p class="text-red-500">{errorMessage}</p>
			{/if}
		</div>
		<div class="flex items-center justify-center">
			<Button
				className="bg-red-500 text-white"
				disabled={errorMessage}
				on:click={() => createStripeAccount()}
			>
				Create
			</Button>
		</div>
	</div>
	<hr style="padding-top:24px;padding-bottom:24px;" />
	<h2>Connected Stripe Tokens</h2>
	{#each tokenObjects as token (token.ID)}
		<div class="grid grid-cols-4 gap-4 items-center border p-4 rounded">
			<div>
				{#if token.default}Default!{/if}
			</div>
			<div>
				<Label for="description-{token.ID}" class="block mb-2">Description</Label>
				<Input
					id="description-{token.ID}"
					size="lg"
					value={token.description}
					disabled
					class="w-full"
				/>
			</div>
			<div>
				<Label for="token-{token.ID}" class="block mb-2">Token</Label>
				<Input id="token-{token.ID}" size="lg" value={token.token} disabled class="w-full" />
			</div>

			<div class="flex items-center justify-center">
				{#if !token.linked}
					<Button
						on:click={() => createStripeAccountLink(token.token)}
						class="bg-green-500 text-white"
					>
						Link Account
					</Button>
				{/if}
				{#if token.linked && !token.default}
					<Button
						className="bg-red-500 text-white"
						on:click={() => makeDefaultStripeConnection(token.ID)}
					>
						Set as default
					</Button>
				{/if}
				<Button className="bg-red-500 text-white" on:click={() => deleteStripeConnection(token.ID)}>
					Delete
				</Button>
			</div>
		</div>
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
