<script>
	import Button from '@components/Button/Button.svelte';
	import DateTimePicker from '@components/DateTimePicker/DateTimePicker.svelte';
	import TicketSelector from '@components/TicketsSelect/TicketSelector.svelte';
	import { getAppliesToMessage } from '@utils/helper';
	import {
		Checkbox,
		Dropdown,
		DropdownItem,
		Input as FlowbiteInput,
		Label,
		Radio,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { ChevronDownOutline, DotsHorizontalOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { toast } from 'svelte-sonner';

	export let token = '';
	export let data = {};
	export let getData = () => {};
	export let visibleAvailableTickets = [];
	export let hiddenAvailableTickets = [];
	export let promoCodes = [];
	let promoCodeName = '';
	let revealHiddenTickets = false;
	let ticketLimit = 'unlimited';
	let ticketDiscount = '';
	let ticketDiscountAmountDollar = '';
	let ticketDiscountAmountParcent = '';
	let startsRadio = 0;
	let endsRadio = 0;
	let provideDiscount = false;
	let promoCodeStartDateTime = new Date().toISOString().slice(0, 16);
	let promoCodeEndsScheduledTime = new Date().toISOString().slice(0, 16);
	let AllVisibleTikets = false;
	let OnlyCertainVisibleTickets = false;
	let ApplyToAllHiddenTickets = false;
	let OnlyCertainHiddenTickets = false;
	let selectedTickets = [];
	let isAddPromoCodeClicked = false;
	let isPromoCodeloading = false;
	let promoCodeNameError = '';
	let discountError = '';
	let amountError = '';
	let percentError = '';
	let dateTimeError = '';

	$: provideDiscount = ticketDiscountAmountDollar !== '' || ticketDiscountAmountParcent !== '';

	$: if (revealHiddenTickets) {
		selectedTickets = [];
		AllVisibleTikets = false;
		OnlyCertainVisibleTickets = false;
	} else {
		ApplyToAllHiddenTickets = false;
		OnlyCertainHiddenTickets = false;
		selectedTickets = [];
	}

	function getStatusColor(status) {
		switch (status) {
			case 'Active':
				return 'text-[#15A033]';
			case 'On hold':
				return 'text-[#FF922E]';
			case 'Ended':
				return 'text-[#FF6666]';
			default:
				return 'text-gray-500';
		}
	}

	function handleDollarInput(e) {
		ticketDiscountAmountDollar = e.target.value;
		if (ticketDiscountAmountDollar !== '') {
			ticketDiscountAmountParcent = '';
		}
	}

	function handlePercentInput(e) {
		const percent = parseFloat(ticketDiscountAmountParcent);
		ticketDiscountAmountParcent = e.target.value;
		if (ticketDiscountAmountParcent !== '') {
			ticketDiscountAmountDollar = '';
		}
		if (!isNaN(percent) && percent > 100) {
			percentError = 'Percentage discount cannot be more than 100%';
		} else {
			percentError = '';
		}
	}

	function handleAllVisibleTicketsChange() {
		if (AllVisibleTikets) {
			OnlyCertainVisibleTickets = false;
			selectedTickets = [];
		}
	}

	function handleOnlyCertainVisibleTicketsChange() {
		if (OnlyCertainVisibleTickets) {
			AllVisibleTikets = false;
		}
	}

	function handleApplyToAllChange() {
		if (ApplyToAllHiddenTickets) {
			OnlyCertainHiddenTickets = false;
			selectedTickets = [];
		}
	}

	function handleOnlyCertainChange() {
		if (OnlyCertainHiddenTickets) {
			ApplyToAllHiddenTickets = false;
		}
	}

	function getDateTimeISO(date, time) {
		if (!date || !time) return null;

		const hasAMPM = time.toLowerCase().includes('am') || time.toLowerCase().includes('pm');
		let time24 = time;
		if (hasAMPM) {
			const [rawTime, modifier] = time.split(' ');
			let [hours, minutes] = rawTime.split(':').map(Number);
			if (modifier.toLowerCase() === 'pm' && hours < 12) {
				hours += 12;
			}
			if (modifier.toLowerCase() === 'am' && hours === 12) {
				hours = 0;
			}
			const hh = String(hours).padStart(2, '0');
			const mm = String(minutes).padStart(2, '0');
			time24 = `${hh}:${mm}`;
		}
		const fullTime = `${time24}:00Z`;
		return `${date}T${fullTime}`;
	}

	function validateDateTime() {
		if (startsRadio === 1 && endsRadio === 1) {
			const startDate = new Date(promoCodeStartDateTime);
			const endDate = new Date(promoCodeEndsScheduledTime);

			if (endDate <= startDate) {
				dateTimeError = 'End date and time must be after start date and time';
				return false;
			}

			dateTimeError = '';
			return true;
		}
		return true;
	}

	function handleStartDateTimeChange() {
		if (startsRadio === 1 && endsRadio === 1) {
			validateDateTime();
		}
	}

	function handleEndDateTimeChange() {
		if (startsRadio === 1 && endsRadio === 1) {
			validateDateTime();
		}
	}

	async function addPromoCode() {
		if (!promoCodeName) {
			promoCodeNameError = 'Promo code name is required';
			return;
		}

		if (!validateDateTime()) {
			return;
		}

		let ticketLimitValue = 0;
		discountError = '';
		amountError = '';
		promoCodeNameError = '';
		dateTimeError = '';

		if (!revealHiddenTickets) {
			const dollar = parseFloat(ticketDiscountAmountDollar);
			const percent = parseFloat(ticketDiscountAmountParcent);

			if ((isNaN(dollar) || dollar <= 0) && (isNaN(percent) || percent <= 0)) {
				discountError = 'Discount amount is required.';
				return;
			}

			if (!isNaN(dollar) && !isNaN(percent)) {
				discountError = 'Please enter only one discount value — not both.';
				return;
			}
		}

		let ticketDiscountAmount;
		let ticketDiscountType = '$';

		if (!isNaN(parseFloat(ticketDiscountAmountDollar))) {
			ticketDiscountAmount = parseFloat(ticketDiscountAmountDollar);
			ticketDiscountType = '$';
		} else if (!isNaN(parseFloat(ticketDiscountAmountParcent))) {
			ticketDiscountAmount = parseFloat(ticketDiscountAmountParcent);
			ticketDiscountType = '%';
		}

		if (ticketLimit === 'limitedTo') {
			const amount = parseInt(ticketDiscount, 10);
			if (isNaN(amount) || amount <= 0) {
				amountError = 'Amount is required.';
				return;
			}
			ticketLimitValue = amount;
		} else {
			ticketLimitValue = 0;
		}

		const formatDateTime = (dateTimeStr) => {
			if (!dateTimeStr) return null;
			return dateTimeStr + ':00Z';
		};

		const startDateTime = startsRadio === 1 ? formatDateTime(promoCodeStartDateTime) : null;
		const endDateTime = endsRadio === 1 ? formatDateTime(promoCodeEndsScheduledTime) : null;

		isAddPromoCodeClicked = true;

		const body = {
			eventID: parseInt(data.eventID, 10),
			name: promoCodeName,
			revealHiddenTickets,
			amount: ticketDiscountAmount,
			ticketLimit: ticketLimitValue,
			promoCodeStarts: startDateTime,
			promoCodeEnds: endDateTime,
			discountType: ticketDiscountType,
			provideDiscount,
			applyCodeToAllController: revealHiddenTickets ? ApplyToAllHiddenTickets : AllVisibleTikets,
			venueIDs: revealHiddenTickets
				? ApplyToAllHiddenTickets
					? hiddenAvailableTickets?.map((ticket) => ticket.ID)
					: selectedTickets.map((ticket) => ticket.ID)
				: AllVisibleTikets
				? visibleAvailableTickets?.map((ticket) => ticket.ID)
				: selectedTickets.map((ticket) => ticket.ID),
			revealTicketIDs: revealHiddenTickets
				? ApplyToAllHiddenTickets
					? hiddenAvailableTickets?.map((ticket) => ticket.ID)
					: selectedTickets.map((ticket) => ticket.ID)
				: AllVisibleTikets
				? visibleAvailableTickets?.map((ticket) => ticket.ID)
				: selectedTickets.map((ticket) => ticket.ID)
		};

		const response = await fetch('http://localhost:8080/api/protected/createPromoCode', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(body)
		});

		if (response.ok) {
			promoCodeNameError = '';
			amountError = '';
			discountError = '';
			percentError = '';
			dateTimeError = '';
			selectedTickets = [];
			isAddPromoCodeClicked = false;
			const result = await response.json();
			ticketDiscountAmount = undefined;
			ticketDiscountAmountDollar = undefined;
			ticketDiscountAmountParcent = undefined;
			ticketLimitValue = undefined;
			promoCodeName = '';

			revealHiddenTickets = false;
			AllVisibleTikets = false;
			OnlyCertainVisibleTickets = false;
			ApplyToAllHiddenTickets = false;
			OnlyCertainHiddenTickets = false;
			ticketDiscountType = '';
			ticketDiscount = undefined;
			startsRadio = 0;
			endsRadio = 0;
			toast.success('Successfully Add the promo code!', {
				position: 'top-right'
			});

			getData();
		} else if (response.status === 400) {
			isAddPromoCodeClicked = false;
		} else {
			isAddPromoCodeClicked = false;
		}
	}

	async function deletePromoCode(promoCode) {
		isPromoCodeloading = true;
		const response = await fetch('http://localhost:8080/api/protected/promoCodes/' + promoCode, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		if (response.ok) {
			getData();
			isPromoCodeloading = false;
			toast.success('Successfully Delete the promo code!', {
				position: 'top-right'
			});
			// Emit event to refresh data
		} else {
			isPromoCodeloading = false;
		}
	}
</script>

<div class="flex flex-col">
	<div class="border-gray-200">
		<h2 class="text-[#0D1526] text-xl font-normal mb-6 pt-2">Add promo code</h2>

		<div class="space-y-6">
			<div>
				<Label class="block text-sm leading-4 font-medium text-[#0D1526] mb-2"
					>Promo code name</Label
				>
				<FlowbiteInput
					type="text"
					bind:value={promoCodeName}
					placeholder="Promo code"
					class="w-full p-2 border rounded-md"
				/>
				{#if promoCodeNameError && !promoCodeName}
					<p class="text-sm text-red-500 mt-1">Promo code name is required</p>
				{/if}
			</div>

			<div>
				<Label class="flex items-center space-x-2 py-1">
					<input type="checkbox" bind:checked={revealHiddenTickets} class="rounded w-3 h-3" />
					<span class="text-sm leading-4 font-medium text-[#0D1526]">Reveal hidden tickets</span>
				</Label>
			</div>

			<div class="flex gap-4">
				<div class="w-full">
					<Label class="block text-sm font-medium leading-[14px] text-[#0D1526] mb-2"
						>Ticket limit</Label
					>
					<div class="relative w-full">
						<Select
							bind:value={ticketLimit}
							class="appearance-none w-full p-2 h-10 border rounded-md text-sm text-[#0D1526] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="limitedTo">Limited to</option>
							<option value="unlimited">Unlimited</option>
						</Select>
						<ChevronDownOutline
							class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500 text-2xl"
						/>
					</div>
					<span class="text-sm text-gray-500 font-normal relative top-1">
						Total number of tickets that can be purchased with the code</span
					>
				</div>
				{#if ticketLimit === 'limitedTo'}
					<div class="max-w-52">
						<Label class="block text-sm leading-[14px] font-medium text-[#0D1526] mb-2">
							Amount
						</Label>
						<div class="flex">
							<FlowbiteInput
								bind:value={ticketDiscount}
								type="number"
								min={0}
								class="w-full p-2  border flex justify-center items-center rounded-r-md"
							/>
						</div>
						{#if amountError && !ticketDiscount}
							<p class="text-sm text-red-500 mt-1">{amountError}</p>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex items-end gap-4">
				<div class="flex-1">
					<Label class="block text-sm leading-[14px] font-medium text-[#0D1526] mb-2">
						Discount amount {#if revealHiddenTickets}(optional){/if}
					</Label>
					<div class="relative">
						<span class="absolute inset-y-0 left-3 flex items-center text-gray-500 text-sm">
							$
						</span>
						<FlowbiteInput
							disabled={ticketDiscountAmountParcent}
							min={0}
							bind:value={ticketDiscountAmountDollar}
							on:input={handleDollarInput}
							type="number"
							class="pl-6 pr-3 h-10 w-full border rounded-md text-sm"
						/>
					</div>
					<div class="min-h-[20px] pt-1 mt-0.5">
						{#if discountError && !ticketDiscountAmountDollar}
							<p class="text-red-500 text-sm">{discountError}</p>
						{/if}
					</div>
				</div>

				<div class="pb-[36px] text-sm font-medium text-gray-600">or</div>

				<div class="flex-1">
					<Label class="invisible block text-sm mb-2">Placeholder</Label>
					<div class="relative">
						<span class="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">
							%
						</span>
						<FlowbiteInput
							disabled={ticketDiscountAmountDollar}
							bind:value={ticketDiscountAmountParcent}
							on:input={handlePercentInput}
							type="number"
							class="pl-3 pr-6 h-10 w-full border rounded-md text-sm"
						/>
					</div>
					<div class="min-h-[20px] mt-1">
						{#if percentError && !ticketDiscountAmountParcent}
							<p class="text-red-500 text-sm mt-1">{percentError}</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4 pt-2">
				<div>
					<h3 class="text-sm font-medium leading-[14px] text-[#0D1526] mb-4">Promo code starts</h3>

					<div class="space-y-4">
						<Label class="flex items-center space-x-2">
							<Radio type="radio" name="startsRadio" bind:group={startsRadio} value={0} />
							<span class="text-sm font-normal leading-[14px] text-[#0D1526]">Now</span>
						</Label>

						<Label class="flex items-center space-x-2">
							<Radio type="radio" name="startsRadio" bind:group={startsRadio} value={1} />
							<span class="text-sm font-normal leading-[14px] text-[#0D1526]">Scheduled time</span>
						</Label>

						{#if startsRadio === 1}
							<div class="max-w-60 flex md:flex-row md:gap-3 gap-2 flex-col">
								<DateTimePicker
									type="datetime-local"
									id="startDateTime"
									required
									bind:value={promoCodeStartDateTime}
									on:change={handleStartDateTimeChange}
								/>
							</div>
						{/if}
					</div>
				</div>
				<div>
					<h3 class="text-sm font-medium leading-[14px] text-[#0D1526] mb-4">Promo code ends</h3>
					<div class="space-y-4">
						<Label class="flex items-center space-x-2">
							<Radio type="radio" name="endsRadio" bind:group={endsRadio} value={0} />
							<span class="text-sm font-normal leading-[14px] text-[#0D1526]"
								>When ticket sales end</span
							>
						</Label>
						<Label class="flex items-center space-x-2">
							<Radio type="radio" name="endsRadio" bind:group={endsRadio} value={1} />
							<span class="text-sm font-normal leading-[14px] text-[#0D1526]"> Scheduled time</span>
						</Label>

						{#if endsRadio === 1}
							<div class="max-w-60 flex md:flex-row md:gap-3 gap-2 flex-col">
								<DateTimePicker
									type="datetime-local"
									id="endDateTime"
									required
									bind:value={promoCodeEndsScheduledTime}
									on:change={handleEndDateTimeChange}
								/>
							</div>
							{#if dateTimeError}
								<p class="text-sm text-red-500 mt-1">{dateTimeError}</p>
							{/if}
						{/if}
					</div>
				</div>
			</div>

			<div class="py-3">
				<h3 class="text-sm leading-4 font-medium text-[#0D1526] pb-4">Apply code to</h3>
				<div class="space-y-4">
					{#if revealHiddenTickets === false}
						<Label class="flex items-center space-x-2">
							<Checkbox
								type="checkbox"
								bind:checked={AllVisibleTikets}
								class="rounded-full"
								on:change={handleAllVisibleTicketsChange}
							/>
							<span class="text-[#252B37] font-normal text-sm leading-4">All visible tickets</span>
						</Label>

						<Label class="flex items-center space-x-2">
							<Checkbox
								type="checkbox"
								bind:checked={OnlyCertainVisibleTickets}
								class="rounded-full"
								on:change={handleOnlyCertainVisibleTicketsChange}
							/>
							<span class="text-[#252B37] font-normal text-sm leading-4"
								>Only certain visible tickets</span
							>
						</Label>

						{#if OnlyCertainVisibleTickets}
							<TicketSelector availableTickets={visibleAvailableTickets} bind:selectedTickets />
						{/if}
					{/if}

					{#if revealHiddenTickets === true}
						<Label class="flex items-center space-x-2">
							<Checkbox
								type="checkbox"
								bind:checked={ApplyToAllHiddenTickets}
								class="rounded-full"
								on:change={handleApplyToAllChange}
							/>
							<span class="text-[#252B37] font-normal text-sm leading-4"
								>Apply to all hidden tickets</span
							>
						</Label>

						<Label class="flex items-center space-x-2">
							<Checkbox
								type="checkbox"
								bind:checked={OnlyCertainHiddenTickets}
								class="rounded-full"
								on:change={handleOnlyCertainChange}
							/>
							<span class="text-[#252B37] font-normal text-sm leading-4"
								>Only certain hidden tickets</span
							>
						</Label>

						{#if OnlyCertainHiddenTickets}
							<TicketSelector availableTickets={hiddenAvailableTickets} bind:selectedTickets />
						{/if}
					{/if}
				</div>
			</div>

			<Button
				disabled={isAddPromoCodeClicked}
				on:click={() => addPromoCode()}
				class="bg-[#0284FE] border border-[#0284FE] text-white text-sm py-1.5 px-2 rounded-lg hover:bg-blue-600 transition-colors"
			>
				{isAddPromoCodeClicked ? 'Saving ...' : 'Save changes'}
			</Button>

			<div class="mt-8">
				<div class="bg-gray-300 rounded-lg overflow-hidden md:block hidden">
					<Table class="min-w-full">
						<TableHead class="bg-[#F7F7F8] ">
							<TableHeadCell class="px-6 py-6 text-sm font-normal text-[#666C79] normal-case">
								Code name
							</TableHeadCell>
							<TableHeadCell class="px-6 text-sm font-normal text-[#666C79] normal-case">
								Promotion type
							</TableHeadCell>
							<TableHeadCell class="px-6 text-sm font-normal text-[#666C79] normal-case">
								Value
							</TableHeadCell>
							<TableHeadCell class="px-6 text-sm font-normal text-[#666C79] normal-case">
								Uses / Limit
							</TableHeadCell>
							<TableHeadCell class="px-6 text-sm font-normal text-[#666C79] normal-case">
								Applied to
							</TableHeadCell>

							<TableHeadCell class="px-6 text-sm font-normal text-[#666C79] normal-case">
								Status
							</TableHeadCell>
							<TableHeadCell class="px-6" />
						</TableHead>

						<TableBody class="divide-y divide-gray-200">
							{#each promoCodes as code}
								<TableBodyRow class="bg-white hover:bg-gray-50">
									<TableBodyCell class="px-6 py-4 text-sm text-[#0D1526] font-normal">
										{code.name}
									</TableBodyCell>
									<TableBodyCell class="px- py-4 text-sm text-[#0D1526] font-normal">
										<div class="flex flex-col gap-1">
											{#if code.provideDiscount && code.amount}
												<div
													class=" bg-red-400 text-white text-sm font-medium rounded border w-[75px] py-0.5 text-center"
												>
													Discount
												</div>
											{/if}
											{#if code.revealHiddenTickets}
												<div
													class="bg-indigo-500 text-white text-sm font-medium rounded border w-[65px] px-2 py-0.5 text-center"
												>
													Reveal
												</div>
											{/if}
										</div>
									</TableBodyCell>
									<TableBodyCell class="px-6 py-4 text-sm text-[#252B37] font-normal">
										{code.discountType === '$' ? `$${code.amount || ''}` : `${code.amount || ''}%`}
									</TableBodyCell>
									<TableBodyCell class="px-6 py-4 text-sm text-[#666C79] font-normal">
										{#if code.ticketLimit === 0}
											0 / Unlimited
										{:else}
											0 / {code.ticketLimit || 0}
										{/if}
									</TableBodyCell>
									<TableBodyCell class="px-6 py-4 text-sm text-[#666C79] font-normal">
										{getAppliesToMessage(code, hiddenAvailableTickets, visibleAvailableTickets)}
									</TableBodyCell>

									<TableBodyCell class="px-6 py-4 text-sm">
										<span class={getStatusColor(code.status || 'Active')}
											>{code.status || 'Active'}</span
										>
									</TableBodyCell>
									<TableBodyCell class="px-6 py-4 text-right">
										<div class="relative md:block hidden">
											<Button class="text-gray-500 !p-2">
												<DotsHorizontalOutline class="w-8 h-8" />
											</Button>

											<Dropdown
												placement="left"
												style="z-index: 99"
												class="bg-white shadow-lg rounded-lg border border-gray-200 w-48 z-50"
											>
												<DropdownItem class="text-red-500">
													<Button
														on:click={() => deletePromoCode(code.ID)}
														class="flex items-center gap-3 w-full py-2 text-left text-red-500 hover:bg-none"
														disabled={isPromoCodeloading}
													>
														{#if isPromoCodeloading}
															<span>Deleting...</span>
														{:else}
															<TrashBinSolid />
															<span>Delete</span>
														{/if}
													</Button>
													<!-- <Button
							  class="flex items-center gap-3 w-full py-2 text-left bg-white text-gray-500 hover:bg-none"
							>
							  <EditOutline />
							  <span>Edit</span>
							</Button> -->
												</DropdownItem>
											</Dropdown>
										</div>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
				</div>

				<!-- Mobile screen  -->
				<div class="w-full md:hidden block">
					{#each promoCodes as code, index}
						<div class="py-2 px-4 border-b last:border-b-0">
							<div class="flex justify-between items-start mb-1">
								<div>
									<div class="flex items-center gap-2">
										<span class="font-normal text-[#0D1526] text-sm">Name : {code.name}</span>
										<span class={`text-base ${getStatusColor(code.status || 'Active')}`}
											>{code.status || 'Active'}</span
										>
									</div>
									<div class="text-[#666C79] text-sm leading-4 mt-2">
										Uses : {#if code.ticketLimit === 0}
											0 / Unlimited
										{:else}
											0 / {code.ticketLimit}
										{/if}
									</div>
								</div>
								<div class="text-right">
									<div class="text-[#666C79] leading-4 text-sm">Applies discount</div>
									<div class="text-[#252B37] fonr-normal leading-4 text-sm mt-2.5">
										Amount : {code.amount}
									</div>
								</div>
							</div>
						</div>

						{#if index < code.length - 1}
							<div class="border-t border-gray-200" />
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
