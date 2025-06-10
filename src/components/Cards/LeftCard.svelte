<script>
	import NoteEdit from '../../assets/svg/note-edit.svg';
	import UserCardDetails from '../Cards/UserCardDetails.svelte';

	import Notedit from '../../assets/svg/note-edit-dark.svg';
	import Button from '../Button/Button.svelte';
	import Input from '../Input/Input.svelte';
	export let customerName = '';
	export let email = '';
	export let phone = '';
	export let orderTotal = '';
	export let tickets = 0;
	export let purchaseDate = '';
	export let purchaseTime = '';
	export let paymentMethod = '•••• •••• •••• ';
	export let userDetails = {
		userProfileUrl: ''
	};
	export let eventTitle = '';
	export let eventDate = '';
	export let eventTime = '';
	export let eventLocation = '';
	export let orderNotes = '';
	export let orderId = '';
	export let eventID = '';
	export let venueID = '';
	let submitNote = false;

	let isNoteEdit = false;
	let noteEditText = '';
	let error = '';
	async function updateOrderNotes() {
		const response = await fetch(
			`http://localhost:8080/api/protected/updateOrderNotes/${orderId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application.json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include',
				body: JSON.stringify({ notes: orderNotes })
			}
		);
		if (response.ok) {
			isNoteEdit = false;
		} else {
			error = 'failure';
		}
	}
</script>

<div class="bg-white shadow-sm rounded-lg p-2 sm:p-6 border border-gray-200">
	<div class="grid grid-cols-12 gap-4">
		{#if userDetails.userProfileUrl}
			<div class="col-span-12 lg:col-span-4">
				<UserCardDetails
					{venueID}
					image={userDetails.userProfileUrl}
					title={eventTitle}
					{eventID}
					manageText="Manage Event"
					date={eventDate}
					time={eventTime}
					location={eventLocation}
					onManageClick={() => console.log('marked')}
				/>
			</div>
		{/if}
		<div class="col-span-12 {userDetails.userProfileUrl ? 'lg:col-span-8' : ''}">
			<div class="grid grid-cols-2 md:grid-cols-3 gap-4 items-start">
				<div class="space-y-2 text-gray-700">
					<div>
						<span class="text-sm font-normal text-gray-500">Customer name</span>
						<p class="text-sm md:text-base font-medium text-gray-900" style="word-wrap:anywhere;">
							{customerName}
						</p>
					</div>
					<div>
						<span class="text-sm font-normaltext-gray-500">Email address</span>
						<p class="text-sm md:text-base font-medium text-gray-900" style="word-wrap:anywhere;">
							{email}
						</p>
					</div>
					<div>
						<span class="text-sm font-normaltext-gray-500">Phone</span>
						<p class="text-sm md:text-base font-medium text-gray-900">
							{phone}
						</p>
					</div>
				</div>
				<div class="space-y-4 text-gray-700">
					<div class="flex justify-between items-center">
						<div>
							<span class="text-sm font-normaltext-gray-500">Order Total</span>
							<p class="text-sm md:text-base font-medium text-gray-900">
								{orderTotal}
							</p>
						</div>
					</div>
					<div>
						<span class="text-sm font-normaltext-gray-500">Number of tickets</span>
						<p class="text-sm md:text-base font-medium text-gray-900">
							{tickets}
						</p>
					</div>
					<div>
						<span class="text-sm font-normaltext-gray-500">Purchase date</span>
						<p class="font-medium text-sm md:text-base text-gray-900">
							{purchaseDate}
						</p>
						<p class="font-medium text-sm md:text-base text-gray-900">
							{purchaseTime}
						</p>
					</div>
				</div>
				<div class="">
					<span class="text-sm font-normal text-gray-500 w-full">Payment Method</span>
					<div class="flex items-center space-x-2">
						<div class="bg-red-500 w-4 h-4 rounded-full" />
						<p class="text-sm md:text-base font-medium text-gray-900">
							{paymentMethod}
						</p>
					</div>
				</div>
			</div>

			<div class="border-t mt-4 sm:mt-5">
				<span>{orderNotes}</span>
				{#if !isNoteEdit && !submitNote}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="flex items-center cursor-pointer p-3.5 mt-3 md:mt-6 md:pb-2"
						on:click={() => (isNoteEdit = true)}
					>
						<img class="h-5 w-5" src={NoteEdit} alt="note-edit" />
						<p class="ml-2 text-primary-500 text-sm">Add order note</p>
					</div>
				{/if}
				{#if !submitNote && isNoteEdit}
					<div class="flex items-center w-full gap-4 flex-wrap pt-3">
						<Input
							type="textarea"
							size="full"
							bind:value={orderNotes}
							className="h-14 px-2 leading-5 w-full md:w-96 "
						/>

						<div>
							<Button
								className="px-12"
								size="lg"
								on:click={() => {
									if (orderNotes) {
										submitNote = true;
										updateOrderNotes();
									}
								}}
							>
								Add
							</Button>
							<Button
								strokebtn
								className="px-10 border-none"
								size="lg"
								on:click={() => ((isNoteEdit = false), (submitNote = false))}>Cancel</Button
							>
						</div>
					</div>
				{:else if submitNote && orderNotes}
					<div class="flex items-center gap-2 py-1 md:pt-3">
						<img src={Notedit} alt="Note edit" class="shrink-0" />
						<div class="flex flex-col w-full md:w-96 px-1">
							<p class="text-sm text-gray-700 break-words">
								{orderNotes}
							</p>
						</div>
						<button
							class="text-sm text-primary-500 font-medium mt-2"
							on:click={() => {
								orderNotes = orderNotes;
								submitNote = false;
							}}
						>
							Edit
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
