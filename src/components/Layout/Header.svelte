<script>
	import { page } from '$app/stores';
	import { Avatar, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { jwtDecode } from 'jwt-decode';
	import { onMount } from 'svelte';
	import ProfilePic from '../../lib/images/default-avatar.png';
	import Logo from '../../lib/images/micdrop.png';

	$: activeUrl = $page.url.pathname;
	$: fullName = '';
	$: avatarPosition1 = '';
	$: email = '';
	onMount(() => {
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
				fullName = decodedToken.organization_user_fullname;
				avatarPosition1 = decodedToken.avatar_url;
				email = decodedToken.email;
			} catch (error) {
				console.error('Invalid token:', error);
			}
		} else {
			console.warn('performer_token cookie not found');
		}
	});
</script>

<header
	class="sticky sm:static h-14 bg-white dark:bg-BG-darkPrimary items-center justify-between px-4 border-b border-stroke-Primary dark:border-stroke-darkPrimary z-10 flex"
>
	<div class="flex flex-1 flex-row items-center gap-4 dark:text-white mr-4">
		<a href="/"><img src={Logo} alt="Micdrop" width="100px" height="" /></a>
	</div>

	<div class="h-full">
		<div class="acs h-full flex flex-col items-center justify-center">
			<Avatar class="w-8 h-8 rounded-lg" src={ProfilePic} />
		</div>
		<Dropdown triggeredBy=".acs" {activeUrl}>
			<div slot="header" class="px-4 py-2 text-sm text-Text-Primary dark:text-Text-darkPrimary">
				<span class="block font-medium"> {fullName} </span>
				<span class="block truncate"> {email} </span>
			</div>
			<DropdownItem class="text-Text-Tartiary dark:text-Text-darkTartiary" href="/operator/profile">
				Account settings
			</DropdownItem>
			<DropdownItem slot="footer" class="text-red-600" href="/auth/signout?userType=operator"
				>Sign out</DropdownItem
			>
		</Dropdown>
	</div>
</header>
