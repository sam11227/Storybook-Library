<script>
	import { Toggle } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { z } from 'zod';
	import Button from '../../../../components/Button/Button.svelte';
	export let performerID;
	// Initialize writable stores
	let performerNotifications = writable({
		confirms: { label: 'Confirms', email: false, sms: false },
		declines: { label: 'Declines', email: false, sms: false },
		cancels: { label: 'Cancels', email: false, sms: false },
		sendMessages: { label: 'Send messages', email: false, sms: false },
		allConfirmed: { label: 'All confirmed', email: false, sms: false }
	});

	let eventNotifications = writable({
		orderCompleted: { label: 'Order completed', email: false, sms: false },
		almostSoldOut: { label: 'Almost sold out', email: false, sms: false },
		soldOut: { label: 'Sold out', email: false, sms: false },
		lowTicketSales: { label: 'Low ticket sales', email: false, sms: false }
	});

	const notificationSchema = z.object({
		performerNotifications: z.object({
			confirms: z.object({
				email: z.boolean(),
				sms: z.boolean()
			}),
			declines: z.object({
				email: z.boolean(),
				sms: z.boolean()
			}),
			cancels: z.object({
				email: z.boolean(),
				sms: z.boolean()
			}),
			sendMessages: z.object({
				email: z.boolean(),
				sms: z.boolean()
			}),
			allConfirmed: z.object({
				email: z.boolean(),
				sms: z.boolean()
			})
		}),
		eventNotifications: z.object({
			orderCompleted: z.object({
				email: z.boolean(),
				sms: z.boolean()
			}),
			almostSoldOut: z.object({
				email: z.boolean(),
				sms: z.boolean()
			}),
			soldOut: z.object({
				email: z.boolean(),
				sms: z.boolean()
			}),
			lowTicketSales: z.object({
				email: z.boolean(),
				sms: z.boolean()
			})
		})
	});

	async function getData() {
		const response = await fetch('http://localhost:8080/api/protected/me', {
			credentials: 'include',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			}
		});
		if (response.ok) {
			const meResult = await response.json();

			// Update performerNotifications store
			performerNotifications.set({
				confirms: {
					label: 'Confirms',
					email: meResult.notifyPartnerConfirmEmail,
					sms: meResult.notifyPartnerConfirmSMS
				},
				declines: {
					label: 'Declines',
					email: meResult.notifyPartnerDeclineEmail,
					sms: meResult.notifyPartnerDeclineSMS
				},
				cancels: {
					label: 'Cancels',
					email: meResult.notifyPartnerCancelEmail,
					sms: meResult.notifyPartnerCancelSMS
				},
				sendMessages: {
					label: 'Send messages',
					email: meResult.notifySendMessagesEmail,
					sms: meResult.notifySendMessagesSMS
				},
				allConfirmed: {
					label: 'All confirmed',
					email: meResult.notifyAllConfirmedEmail,
					sms: meResult.notifyAllConfirmedSMS
				}
			});

			// Update eventNotifications store
			eventNotifications.set({
				orderCompleted: {
					label: 'Order completed',
					email: meResult.notifyOrderCompletedEmail,
					sms: meResult.notifyOrderCompletedSMS
				},
				almostSoldOut: {
					label: 'Almost sold out',
					email: meResult.notifyAlmostSoldOutEmail,
					sms: meResult.notifyAlmostSoldOutSMS
				},
				soldOut: {
					label: 'Sold out',
					email: meResult.notifySoldOutEmail,
					sms: meResult.notifySoldOutSMS
				},
				lowTicketSales: {
					label: 'Low ticket sales',
					email: meResult.notifyLowTicketSalesEmail,
					sms: meResult.notifyLowTicketSalesSMS
				}
			});
		} else {
			console.error('Failed to fetch data');
		}
	}

	async function createRow(formData) {
		const currentPerformerNotifications = get(performerNotifications);
		const currentEventNotifications = get(eventNotifications);

		const response = await fetch('http://localhost:8080/api/protected/me', {
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			body: JSON.stringify({
				notifyPartnerConfirmEmail: currentPerformerNotifications.confirms.email,
				notifyPartnerConfirmSMS: currentPerformerNotifications.confirms.sms,
				notifyPartnerDeclineEmail: currentPerformerNotifications.declines.email,
				notifyPartnerDeclineSMS: currentPerformerNotifications.declines.sms,
				notifyPartnerCancelEmail: currentPerformerNotifications.cancels.email,
				notifyPartnerCancelSMS: currentPerformerNotifications.cancels.sms,
				notifySendMessagesEmail: currentPerformerNotifications.sendMessages.email,
				notifySendMessagesSMS: currentPerformerNotifications.sendMessages.sms,
				notifyAllConfirmedEmail: currentPerformerNotifications.allConfirmed.email,
				notifyAllConfirmedSMS: currentPerformerNotifications.allConfirmed.sms,
				notifyOrderCompletedEmail: currentEventNotifications.orderCompleted.email,
				notifyOrderCompletedSMS: currentEventNotifications.orderCompleted.sms,
				notifyAlmostSoldOutEmail: currentEventNotifications.almostSoldOut.email,
				notifyAlmostSoldOutSMS: currentEventNotifications.almostSoldOut.sms,
				notifySoldOutEmail: currentEventNotifications.soldOut.email,
				notifySoldOutSMS: currentEventNotifications.soldOut.sms,
				notifyLowTicketSalesEmail: currentEventNotifications.lowTicketSales.email,
				notifyLowTicketSalesSMS: currentEventNotifications.lowTicketSales.sms
			})
		});

		if (response.ok) {
			const result = await response.json();
			getData();
			alert('Profile successfully updated');
		} else {
			alert('Profile failed to update. Please refresh and try again.');
		}
	}

	let errors = writable({});

	// Submit function
	const handleSubmit = () => {
		const currentPerformerNotifications = $performerNotifications;
		const currentEventNotifications = $eventNotifications;

		const formData = {
			performerNotifications: {
				confirms: currentPerformerNotifications.confirms,
				declines: currentPerformerNotifications.declines,
				cancels: currentPerformerNotifications.cancels,
				sendMessages: currentPerformerNotifications.sendMessages,
				allConfirmed: currentPerformerNotifications.allConfirmed
			},
			eventNotifications: {
				orderCompleted: currentEventNotifications.orderCompleted,
				almostSoldOut: currentEventNotifications.almostSoldOut,
				soldOut: currentEventNotifications.soldOut,
				lowTicketSales: currentEventNotifications.lowTicketSales
			}
		};
		//const result = notificationSchema.safeParse(formData);

		createRow(formData);
	};

	onMount(async () => {
		await getData();
	});
</script>

<section>
	<!-- Section: Receive notification when performer -->
	<div class="mb-6">
		<div class="flex justify-between items-center mb-4">
			<h2 class="text-2xl font-light text-gray-500">Receive notification when performer:</h2>
			<div class="flex min-w-[330px] justify-end text-gray-500">
				<span class="text-right">Email</span>
			</div>
			<div class="flex min-w-[200px] justify-start text-gray-500">
				<span class="text-left">SMS</span>
			</div>
		</div>
		{#each Object.entries($performerNotifications) as [key, notification]}
			<div class="grid grid-cols-6 gap-4 items-center mb-4 border-b py-3">
				<span class="col-span-4">{notification.label}</span>
				<Toggle checked={notification.email} label="Email" color="primary" />
				<Toggle checked={notification.sms} label="SMS" color="primary" />
			</div>
			{#if $errors.performerNotifications?.[key]?.email}
				<p class="text-red-500 text-sm">
					Email: {$errors.performerNotifications[key].email._errors[0]}
				</p>
			{/if}
			{#if $errors.performerNotifications?.[key]?.sms}
				<p class="text-red-500 text-sm">
					SMS: {$errors.performerNotifications[key].sms._errors[0]}
				</p>
			{/if}
		{/each}
	</div>

	<!-- Section: Receive notification about event -->
	<div class="mb-6">
		<h2 class="text-2xl font-light text-gray-500 mb-4">Receive notification about event :</h2>

		{#each Object.entries($eventNotifications) as [key, notification]}
			<div class="grid grid-cols-6 gap-4 items-center mb-4 border-b py-3">
				<span class="col-span-4">{notification.label}</span>
				<Toggle checked={notification.email} label="Email" />
				<Toggle checked={notification.sms} label="SMS" />
			</div>
			{#if $errors.eventNotifications?.[key]?.email}
				<p class="text-red-500 text-sm">
					Email: {$errors.eventNotifications[key].email._errors[0]}
				</p>
			{/if}
			{#if $errors.eventNotifications?.[key]?.sms}
				<p class="text-red-500 text-sm">
					SMS: {$errors.eventNotifications[key].sms._errors[0]}
				</p>
			{/if}
		{/each}
	</div>

	<div class="my-4">
		<Button on:click={handleSubmit}>Save</Button>
	</div>
</section>
