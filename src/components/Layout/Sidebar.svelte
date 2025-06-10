<script>
	import { page } from '$app/stores';
	import { Toggle } from 'flowbite-svelte';
	import { jwtDecode } from 'jwt-decode';
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import Icon from '../../components/Icons/Icon.svelte';
	import { isMobile, updateScreenSize } from '../../stores/screenSize';
	import { isDarkMode } from '../../stores/theme';

	export let links = [];
	export let pageTitle = '';

	let showMoreMenu = false;
	let notifications = [{ id: '1' }];
	let expandedMenu = '';
	let error = null;
	let shows = {
		invitation: []
	};
	$: isCollapsed = false;

	const pagePath = derived(page, ($page) => $page.url.pathname);

	$: isCollapsed =
		pagePath === '/operator/events/create' || /\/operator\/venues\/\d+\/\d+\/?.*/.test(pagePath);

	const toggleMenu = (label) => {
		if (!isCollapsed) {
			expandedMenu = expandedMenu === label ? '' : label;
		}
	};

	const getIconName = (icon, isActive) => {
		return isActive ? icon.replace('-outline', '') : icon;
	};

	const closeExpandedMenu = (event) => {
		const sidebar = document.querySelector('nav');
		if (sidebar && !sidebar.contains(event.target)) {
			expandedMenu = '';
		}
	};

	onMount(() => {
		// Update screen size
		updateScreenSize();
		window.addEventListener('resize', updateScreenSize);

		// Close children menu when clicking outside
		document.addEventListener('click', closeExpandedMenu);

		return () => {
			window.removeEventListener('resize', updateScreenSize);
			document.removeEventListener('click', closeExpandedMenu);
		};
	});

	function saveIsCollapsedToLocalStorage(value) {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('isCollapsed', value);
		}
	}

	function loadIsCollapsedFromLocalStorage() {
		const pathMatches =
			$page.url.pathname === '/operator/events/create' ||
			/\/operator\/venues\/[^\/]+\/[^\/]+\/?.*/.test($page.url.pathname);
		if (pathMatches) {
			isCollapsed = true;
		} else if (typeof localStorage !== 'undefined') {
			const savedValue = localStorage.getItem('isCollapsed');
			if (savedValue !== null) {
				isCollapsed = savedValue === 'true';
			}
		}
	}

	$: organizationName = '';
	$: organizationNameInitials = '';
	onMount(async () => {
		loadIsCollapsedFromLocalStorage();
		// Extract and decode the performer_token cookie
		const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
			const [name, value] = cookie.split('=');
			acc[name] = value;
			return acc;
		}, {});

		const operatorToken = cookies['operator_token'];
		if (operatorToken) {
			try {
				const decodedToken = jwtDecode(operatorToken);
				organizationName = decodedToken.organization_name;
				organizationNameInitials = organizationName
					.split(' ')
					.map((word) => word[0])
					.join('')
					.toUpperCase()
					.slice(0, 4);
			} catch (error) {
				console.error('Invalid token:', error);
			}
		} else {
			console.warn('performer_token cookie not found');
		}
	});
	function toggleIsCollapsed() {
		isCollapsed = !isCollapsed;
		saveIsCollapsedToLocalStorage(isCollapsed);
	}
	const visibleLinks = links.slice(0, 4);
	const moreLinks = links.slice(4);
	$: {
		$page.url.pathname; // Reactively track the page path
		loadIsCollapsedFromLocalStorage();
	}
</script>

<nav class="relative">
	{#if !$isMobile}
		<button
			class="absolute top-4 right-[-12px] w-6 h-7 flex items-center justify-center rounded-full shadow cursor-pointer bg-primary-50 dark:bg-BG-darkPrimary border border-[#0284FE26] hover:bg-primary-100 transition-all dark:text-Icon-darkPrimary {isCollapsed
				? 'rotate-180'
				: ''}"
			on:click={toggleIsCollapsed}
		>
			<Icon name="chevron-left" size="16" />
		</button>
	{/if}

	<!-- Desktop Sidebar -->
	{#if !$isMobile}
		<div
			class="w-[248px] h-full bg-white dark:bg-BG-darkPrimary p-3 hidden overflow-auto md:flex flex-col justify-between border-r border-stroke-Primary dark:border-stroke-darkPrimary {isCollapsed
				? 'w-[70px] overflow-x-hidden'
				: ''}"
		>
			<ul>
				<h2 class="font-semibold text-lg pl-2 pb-3 dark:text-Text-darkSecondary">
					{#if isCollapsed}
						{organizationNameInitials}
					{:else}
						{organizationName}
					{/if}
				</h2>
				{#each links as { label, href, icon, children, mobileOnly }, index}
					{#if !mobileOnly}
						<li class="p-0.5">
							{#if index === links.length - 2}
								<hr class="my-2 border-t border-stroke-Primary dark:border-stroke-darkPrimary" />
							{/if}

							<a
								href={children ? undefined : href}
								class="w-full flex items-center relative {isCollapsed
									? 'px-2 py-1.5'
									: 'px-3 py-2.5 gap-2'} rounded-lg justify-between no-underline text-Text-Tartiary dark:text-Text-darkPrimary hover:no-underline hover:bg-BG-Secondary hover:text-Text-Primary dark:hover:bg-BG-darkTartiary transition-all {href ===
								pagePath
									? 'text-brand-Primary dark:text-brand-darkPrimary hover:text-brand-Primary bg-BG-Tartiary dark:bg-BG-darkTartiary hover:bg-BG-Tartiary dark:hover:bg-BG-darkTartiary'
									: ''}"
								on:click={children ? (e) => toggleMenu(label) : undefined}
								style={children ? 'cursor: pointer;' : ''}
							>
								<Icon
									name={getIconName(
										icon,
										typeof pagePath === 'string' && pagePath === href && pagePath.startsWith(href)
									)}
									size={isCollapsed ? '25' : '20'}
								/>
								{#if !isCollapsed}
									<div class="flex-1 flex flex-row items-center justify-between">
										{label}
										{#if label === 'Notifications' && shows?.invitation?.length > 0}
											<span
												class="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold text-accent-Danger bg-accent-Danger/15 rounded-md ml-2"
											>
												{notifications.length}
											</span>
										{/if}
									</div>
								{/if}

								{#if children && !isCollapsed}
									<button
										class={`text-Text-Tartiary dark:text-Icon-darkPrimary hover:text-Text-Primary ${
											expandedMenu === label ? '' : 'rotate-180'
										}`}
										on:click|stopPropagation={() => toggleMenu(label)}
									>
										<Icon name="chevron-up" size="16" />
									</button>
								{/if}
							</a>

							{#if expandedMenu === label && children && !isCollapsed}
								<ul
									class=" {isCollapsed
										? 'absolute left-20 -mt-10 bg-white dark:bg-BG-darkPrimary rounded-lg min-w-[160px] shadow-md'
										: 'pl-8 mt-2'}"
								>
									{#each children as { label, href }}
										<li class="mb-1">
											<a
												{href}
												class="block p-2 text-Text-Tartiary hover:no-underline dark:text-Text-darkTartiary hover:text-Text-Primary hover:bg-BG-Secondary dark:hover:bg-BG-darkTartiary rounded"
											>
												{label}
											</a>
										</li>
									{/each}
								</ul>
							{/if}
						</li>
					{/if}
				{/each}
			</ul>

			<!-- Change Theme Toggle -->
			<div
				style="display:none;"
				class="py-2 flex flex-row items-center justify-center {isCollapsed
					? 'rotate-90 origin-top-center -translate-y-10 -ml-9 w-[120px] h-[50px]'
					: ''}"
			>
				<Icon name="sun" size="22" color="#FF922E" />
				<Toggle bind:checked={$isDarkMode} label="Theme" class="ml-3" />
				<Icon name="moon" size="22" color="#38A0FF" />
			</div>
		</div>
	{/if}
	<!--
	{#if $isMobile && $isSubPage}
		<div
			class="sticky sm:static h-14 flex bg-white items-center justify-between px-4 border-b border-stroke-Primary"
		>
			<PageBackButton headerTitle={pageTitle} />
		</div>
	{/if}-->

	<!-- Mobile Bottom Navigation -->
	{#if $isMobile}
		<div
			class="fixed bottom-0 left-0 right-0 bg-white dark:bg-BG-darkPrimary dark:mix-blend-hard-light shadow-lg z-50 flex justify-between px-0.5 border-t border-stroke-Primary dark:border-stroke-darkPrimary"
		>
			{#each visibleLinks as { label, href, icon }}
				<a
					{href}
					class="flex-1 p-1 rounded flex flex-col items-center justify-center transition-all hover:no-underline dark:text-Text-darkTartiary {href ===
					'/'
						? typeof pagePath === 'string' && pagePath === href && !showMoreMenu
							? 'font-semibold text-primary-700 dark:text-brand-darkPrimary'
							: ''
						: typeof pagePath === 'string' && pagePath.startsWith(href) && !showMoreMenu
						? 'font-semibold text-primary-700 dark:text-brand-darkPrimary'
						: ''}"
					on:click={() => (showMoreMenu = false)}
				>
					<div
						class="rounded-full px-3 py-1 {href === '/'
							? typeof pagePath === 'string' && pagePath === href && !showMoreMenu
								? 'text-primary-700 bg-BG-Tartiary dark:bg-BG-darkTartiary'
								: ''
							: typeof pagePath === 'string' && pagePath.startsWith(href) && !showMoreMenu
							? 'text-primary-700 bg-BG-Tartiary dark:bg-BG-darkTartiary'
							: ''}"
					>
						<Icon
							name={getIconName(
								icon,
								typeof pagePath === 'string' &&
									pagePath === href &&
									!showMoreMenu &&
									pagePath.startsWith(href)
							)}
							size={isCollapsed ? '25' : '20'}
						/>
					</div>
					<div class="text-xs relative">
						{label}
						{#if label === 'Shows' && shows?.invitation?.length > 0}
							<span
								class="inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full absolute bottom-7 -right-1"
							/>
						{/if}
					</div>
				</a>
			{/each}

			<!-- More Icon -->
			{#if visibleLinks.length > 0}
				<button
					class="flex-1 p-1 rounded flex flex-col items-center justify-center transition-all hover:no-underline dark:text-Text-darkTartiary
        {showMoreMenu ? 'font-semibold text-primary-700 dark:text-brand-darkPrimary' : ''}"
					on:click={() => (showMoreMenu = !showMoreMenu)}
				>
					<div
						class="rounded-full px-3 py-1 {showMoreMenu
							? 'text-primary-700 bg-BG-Tartiary dark:bg-BG-darkTartiary'
							: ''}"
					>
						<Icon name="more" size="20" />
					</div>

					<span class="text-xs">More</span>
				</button>
			{/if}

			<!-- Modal or Dropdown for More Items -->
			{#if showMoreMenu}
				<div class="fixed top-[56px] bottom-[57px] inset-0 bg-BG-Secondary z-50">
					<ul>
						{#each moreLinks as { label, href, icon }}
							<!-- .slice(0, -1) -->
							<li class="p-4 border-b">
								<a
									{href}
									on:click={() => (showMoreMenu = false)}
									class="flex items-center gap-3 no-underline text-Text-Tertiary hover:no-underline hover:text-Text-Primary"
								>
									<Icon name={icon} size="20" />
									<span>{label}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</nav>

<style>
	.is-collapsed ul li span {
		display: none;
	}
</style>
