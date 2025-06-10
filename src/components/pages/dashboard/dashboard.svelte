<script>
	import { onMount } from 'svelte';
	import downIcon from '../../../assets/svg/down.svg';
	import exportIcon from '../../../assets/svg/export.svg';
	import DashboardLineChart from '../../../components/Charts/DashboardLineChart.svelte';
	import CardWrapper from '../../../components/Dashboard/DashboardCards/CardWrapper.svelte';
	import DashboardEventMobileCard from '../../../components/Dashboard/DashboardCards/DashboardEventMobileCard.svelte';
	import RecentOrderMobileCard from '../../../components/Dashboard/DashboardCards/RecentOrderMobileCard.svelte';
	import Notification from '../../../components/Notification/Notification.svelte';
	import StatsCard from '../../../components/Stats/StatsCard.svelte';
	import Table from '../../../components/Table/Table.svelte';

	import totalEvent from '../../../assets/svg/calendar-day.svg';
	import dollar from '../../../assets/svg/dollar.svg';
	import ticket from '../../../assets/svg/ticket.svg';

	import Button from '../../../components/Button/Button.svelte';
	import Progress from '../../../components/Dashboard/Progress/Progress.svelte';
	import Spinner from '../../../components/Spinner/Spinner.svelte';
	import { DashboardTableColumn, RecentOrderTableColumns } from '../../../lib/columns/dashboard';

	let notifications = [];

	let statsData = [
		{
			name: 'Revenue',
			value: '$6,397',
			icon: dollar,
			percentage: 8
		},
		{
			name: 'Ticket Sales',
			value: '100',
			icon: ticket,
			percentage: 1
		},
		{
			name: 'Total events',
			value: '100',
			icon: totalEvent,
			percentage: 11
		}
	];

	let dashboardTableData = [];
	let recentOrder = [];

	let isUpComingEventsloading = true;
	let isLoadingRecentOrder = true;
	let loadingNotification = true;

	async function loadUpcomingEvent() {
		try {
			const response = await fetch('http://localhost:8080/api/dashboard');
			const data = await response.json();

			dashboardTableData = data.upcomingEvents.map((item) => ({
				id: item.id,
				seats: item.seats,
				show: item.eventName,
				email: item.email,
				status: item.status,
				date: item.dateOfPurchase,
				sale: item.sale,
				performers: item.performers
			}));

			isUpComingEventsloading = false;
		} catch (error) {
			isUpComingEventsloading = false;
			console.error('Failed to load notifications:', error);
		}
	}

	async function loadNotifications() {
		try {
			const response = await fetch('http://localhost:8080/api/notifications');
			const data = await response.json();

			notifications = data.notifications.map((notification) => ({
				id: notification.id,
				name: notification.user_name,
				action: notification.action_text,
				event: notification.show_name,
				message: notification.message,
				time: new Date(notification.time),
				avatar: notification.profile_image,
				statusIcon: notification.status_icon,
				status: notification.status
			}));

			loadingNotification = false;
		} catch (error) {
			console.error('Failed to load notifications:', error);
		}
	}

	async function getTransferAll() {
		try {
			const responseData = await fetch('http://localhost:8080/api/recentOrders').then((res) => {
				return res.json();
			});
			isLoadingRecentOrder = false;
			recentOrder = [...responseData];
		} catch (error) {
			isLoadingRecentOrder = false;
			console.error('Failed to load Recent Order:', error);
		}
	}

	$: filteredRecentOrder = recentOrder?.filter((event) => event?.show?.name?.toLowerCase());

	onMount(async () => {
		await getTransferAll();
	});

	onMount(() => {
		loadUpcomingEvent();
		loadNotifications();
	});

	const eventlist = [
		{ date: 'Feb 1, 2020', title: 'Whispers from Your Pages', revenue: 40 },
		{
			date: 'Jan 24, 2020',
			title: 'The Stories in Your Scribbles',
			revenue: 59
		},
		{ date: 'Jan 19, 2020', title: 'The Secrets in Your Jotter', revenue: 36 },
		{ date: 'Jan 20, 2020', title: 'Insights from Your Diary', revenue: 75 },
		{
			date: 'Jan 19, 2020',
			title: 'The Chronicles from Your Journal',
			revenue: 100
		}
	];

	const performingEventsList = [
		{ date: 'Jan 24, 2020', title: 'The Tales of Your Memoirs', revenue: 28 },
		{
			date: 'Feb 1, 2020',
			title: 'The Reflections in Your Logbook',
			revenue: 20
		},
		{ date: 'Feb 1, 2020', title: 'Whispers from Your Pages', revenue: 40 },
		{ date: 'Jan 19, 2020', title: 'The Secrets in Your Jotter', revenue: 36 },
		{ date: 'Jan 20, 2020', title: 'Echoes from Your Notepad', revenue: 32 }
	];
</script>

<div>
	<div class="py-2 px-4">
		<div class="">
			<h2 class="lg:font-normal lg:text-xl lg:leading-[30px] font-base font-medium leading-[24px]">
				Dashboard
			</h2>
			<p class="text-xs leading-[18px] text-gray-500 lg:block hidden">Last 30 days</p>
			<div class="lg:hidden block">
				<div class="flex justify-end gap-2 pt-2 pb-1">
					<Button variant="primary" beforeIcon={exportIcon} afterIcon={downIcon}>Export</Button>
				</div>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border-t border-gray-300 bg-gray-50">
		<div class="flex flex-col gap-8 lg:col-span-8">
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				<StatsCard stats={statsData} />
			</div>
			<div>
				<CardWrapper cardTitle="Upcoming events" linkText="See all" linkHref="/">
					{#if isUpComingEventsloading}
						<div class="flex justify-center items-center h-screen">
							<Spinner />
						</div>
					{:else}
						<div class="lg:block hidden">
							<Table
								columns={DashboardTableColumn}
								showTableHead={false}
								data={dashboardTableData}
								bordered={false}
								isRounded={false}
								searchable={false}
								styles={{
									container: 'w-full align-left  whitespace-nowrap',
									thead:
										'text-[12px] leading-[18px] text-gray-500 border-b font-semibold border-gray-200 uppercase bg-gray-50 px-4 !py-2 cursor-normal ',
									tr: 'text-[14px] text-gray-500 font-medium leading-[21px]',
									td: '!py-2 border-b border-gray-200',
									th: 'pr-0'
								}}
								classes="!p-0 !px-0 "
								hasCheckBox={false}
								keyField="date"
								hasActions={false}
							/>
						</div>
						<div class="lg:hidden">
							<DashboardEventMobileCard events={dashboardTableData} />
						</div>
					{/if}
				</CardWrapper>
			</div>
			<div>
				<CardWrapper
					cardTitle="Revenue"
					linkText="See all"
					cardSubtitle="Last 30 days"
					showToggle={true}
				>
					<DashboardLineChart />
				</CardWrapper>
			</div>
			<div>
				<CardWrapper cardTitle="Recent Orders" linkText="See all" linkHref="/">
					{#if isLoadingRecentOrder}
						<div class="flex justify-center items-center h-screen">
							<Spinner />
						</div>
					{:else}
						<div class="lg:block hidden">
							<Table
								columns={RecentOrderTableColumns}
								data={filteredRecentOrder}
								bordered={false}
								isRounded={false}
								isDraggable={false}
								searchable={false}
								screenSize={false}
								styles={{
									container:
										'w-full align-left overflow-hidden overflow-x-scroll whitespace-nowrap',
									thead:
										'text-[12px] leading-[18px] text-gray-500 border-b font-semibold border-gray-200 uppercase bg-gray-50 px-4 py-4 cursor-normal ',
									tr: 'text-[14px] text-gray-500 font-medium leading-[21px]',
									td: 'py-4 border-b border-gray-200',
									th: '!pr-0'
								}}
								keyField="id"
							/>
						</div>
						<div class="lg:hidden">
							<RecentOrderMobileCard data={filteredRecentOrder} />
						</div>
					{/if}
				</CardWrapper>
			</div>
		</div>
		<div class="flex flex-col gap-4 lg:col-span-4">
			{#if loadingNotification}
				<div class="flex justify-center items-center h-screen">
					<Spinner />
				</div>
			{:else}
				<div>
					<Notification {notifications} />
				</div>
			{/if}
			<div>
				<CardWrapper cardTitle="Top Events" showToggle={true} isEvent={true}>
					<Progress events={eventlist} variant="top" />
				</CardWrapper>
			</div>
			<!-- <div>
		  <CardWrapper
			cardTitle="Underperforming Events"
			showToggle={true}
			isEvent={true}
		  >
			<Progress events={performingEventsList} variant="underperforming" />
		  </CardWrapper>
		</div> -->
		</div>
	</div>
</div>
