<script>
	// name = "TeamTabContent";
	import {
		Dropdown,
		DropdownItem,
		Input,
		Label,
		Modal,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { DotsHorizontalOutline, EditOutline, TrashBinSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import Add from '../../../../assets/svg/add-main.svg';
	import MoreIcon from '../../../../assets/svg/more-actions.svg';
	import UserIcon from '../../../../assets/svg/team-user.svg';
	import Button from '../../../../components/Button/Button.svelte';

	const array = Array(10).fill(10);
	export let subtab;
	let teamUSER = [...array];
	$: addTicketModal = false;
	$: tableView = 'user';
	$: authorizedUsers = [];
	$: addUserNotification = null;
	$: removeUserNotification = null;
	$: roles = [];
	$: email = '';
	$: rolesMap = [];
	$: selectedRole = '1';
	async function getAuthorizedUsers() {
		const response = await fetch('http://localhost:8080/api/protected/authorizedUsers', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include'
		});

		if (response.ok) {
			let result = await response.json();
			authorizedUsers = result.authorizedUsers;
		} else {
			console.error('Failed to fetch authorized users');
		}

		const rolesResponse = await fetch(
			'http://localhost:8080/api/protected/GetOrganizationPermissionRoles',
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include'
			}
		);

		if (rolesResponse.ok) {
			let result = await rolesResponse.json();
			roles = result.permissionsRoles;
			rolesMap = roles.map((role) => ({
				value: role.ID,
				name: role.roleName
			}));

			// Iterate over each authorizedUser and add the role name
			authorizedUsers = authorizedUsers.map((user) => {
				const role = rolesMap.find((role) => role.value === user.organizationRole);
				return {
					...user,
					roleName: role ? role.name : 'Unknown Role'
				};
			});
		} else {
			console.error('Failed to fetch roles');
		}
	}
	$: meResult = {};
	$: organizationName = '';
	async function getOrganizationData() {
		const response = await fetch('http://localhost:8080/api/protected/me', {
			credentials: 'include',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			}
		});
		if (response.ok) {
			meResult = await response.json();
			organizationName = meResult.organizationName;
		} else {
			meResult = 'unauthed';
		}
	}
	let addTicketModal = false;
	let email = '';
	let emailError = '';

	function validateEmail(email) {
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailPattern.test(email);
	}

	async function addAuthorizedUser() {
		if (!validateEmail(email)) {
			emailError = 'Please enter a valid email address.';
			return;
		}
		emailError = '';

		const response = await fetch('http://localhost:8080/api/protected/authorizedUsers', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include',
			body: JSON.stringify({
				authorizedUserEmail: email,
				roleID: parseInt(selectedRole)
			})
		});

		if (response.ok) {
			const result = await response.json();

			addUserNotification = true;
			addTicketModal = false;
			getAuthorizedUsers(); // Refresh the list
		} else {
			console.error('Failed to add authorized user');
			addUserNotification = false;
			addTicketModal = false;
		}
	}
	$: deleteModalOpen = false;
	$: deleteModalName = '';
	$: deleteModalID = 0;
	async function fireDeleteModal(role) {
		deleteModalOpen = true;
		deleteModalName = role.roleName;
		deleteModalID = role.ID;
	}

	async function removeAuthorizedUser(email) {
		const response = await fetch('http://localhost:8080/api/protected/authorizedUsers', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer asdf`
			},
			credentials: 'include',
			body: JSON.stringify({
				authorizedUserEmail: email
			})
		});

		if (response.ok) {
			const result = await response.json();

			removeUserNotification = true;
			getAuthorizedUsers(); // Refresh the list
		} else {
			console.error('Failed to remove authorized user');
			removeUserNotification = false;
		}
	}
	async function deleteRole() {
		const response = await fetch(
			'http://localhost:8080/api/protected/DeleteOrganizationPermissionRole/' + deleteModalID,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer asdf`
				},
				credentials: 'include'
			}
		);

		if (response.ok) {
			const result = await response.json();

			deleteModalOpen = false;
			getAuthorizedUsers(); // Refresh the list
		} else {
			console.error('Failed to remove authorized user');
		}
	}
	onMount(async () => {
		getOrganizationData();
		getAuthorizedUsers();
		// set tableView to role if subtab is role
		if (subtab === 'Role') {
			tableView = 'role';
		}
	});
</script>

<div>
	<div class="w-full p-2 flex justify-between">
		<span class="w-2/4" id="search" size="lg" placeholder="search" />
		<div>
			<Button
				className="md:w-auto"
				beforeIcon={Add}
				on:click={() => (window.location.href = '/operator/settings/invite-user')}
				disabled={roles.length === 0 || organizationName == ''}>Invite User</Button
			>
			<Button
				className="md:w-auto"
				beforeIcon={Add}
				on:click={() => (window.location.href = '/operator/settings/create-role')}
				>Create Role</Button
			>
		</div>
	</div>

	<div class="flex gap-4 my-5">
		<button
			class="flex justify-center text-sm p-3 px-5 rounded-full"
			class:bg-blue-100={tableView === 'user'}
			class:text-brand-Primary={tableView === 'user'}
			class:bg-gray-100={tableView !== 'user'}
			class:text-gray-500={tableView !== 'user'}
			on:click={() => (tableView = 'user')}
		>
			<img src={UserIcon} alt="Before Icon here" class="mr-2 my-auto" />
			Users
		</button>
		<button
			class="flex justify-center text-sm p-3 px-5 rounded-full"
			class:bg-blue-100={tableView === 'role'}
			class:text-brand-Primary={tableView === 'role'}
			class:bg-gray-100={tableView !== 'role'}
			class:text-gray-500={tableView !== 'role'}
			on:click={() => (tableView = 'role')}
		>
			<img src={UserIcon} alt="Before Icon here" class="mr-2 my-auto" />
			Role
		</button>
	</div>
	{#if tableView === 'user'}
		<Table hoverable={true} items={authorizedUsers}>
			<TableHead>
				<TableHeadCell sort={(a, b) => a.type.localeCompare(b.type)}>Name</TableHeadCell>
				<TableHeadCell sort={(a, b) => a.make - b.make} defaultDirection="desc"
					>Email address</TableHeadCell
				>
				<TableHeadCell sort={(a, b) => a.make - b.make} defaultDirection="desc">Role</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">Buy</span>
				</TableHeadCell>
			</TableHead>
			{#if roles.length === 0}
				<span>Add a role to begin adding users.</span>
			{:else}
				<TableBody tableBodyClass="divide-y">
					{#each authorizedUsers as user}
						<TableBodyRow slot="row">
							<TableBodyCell>{user.firstName} {user.lastName}</TableBodyCell>
							<TableBodyCell class="font-light">{user.email}</TableBodyCell>
							<TableBodyCell class="font-light">{user.roleName}</TableBodyCell>
							<TableBodyCell>
								<a
									href="/tables"
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
								>
									<img src={MoreIcon} alt="more-actions" class="mr-2" />
								</a>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			{/if}
		</Table>
	{/if}
	{#if tableView === 'role'}
		<Table hoverable="{true}}">
			<TableHead>
				<TableHeadCell sort={(a, b) => a.type.localeCompare(b.type)}>Name</TableHeadCell>

				<TableHeadCell>
					<span class="sr-only">Buy</span>
				</TableHeadCell>
			</TableHead>
			<TableBody tableBodyClass="divide-y">
				{#each roles as role}
					<TableBodyRow slot="row">
						<TableBodyCell
							class="font-light"
							on:click={() => {
								window.location.href = `/operator/settings/edit-role/${role.ID}`;
							}}
						>
							{role.roleName}
						</TableBodyCell>
						<TableBodyCell>
							<DotsHorizontalOutline
								id={`hamburger-menu-${role.ID}`}
								style="background-color:white;border-radius:4px;padding:4px;"
							/>
							<Dropdown placement="bottom" triggeredBy={`#hamburger-menu-${role.ID}`}>
								<DropdownItem
									on:click={() => {
										window.location.href = `/operator/settings/edit-role/${role.ID}`;
									}}
									><div style="display:flex;flex-direction:row;">
										<EditOutline style="margin-right:4px;" /> Edit
									</div></DropdownItem
								>
								<DropdownItem
									on:click={() => {
										fireDeleteModal(role);
									}}
									target="_blank"
									><div style="display:flex;flex-direction:row;color:red">
										<TrashBinSolid color="red" style="margin-right:4px;" /> Delete
									</div></DropdownItem
								>
							</Dropdown>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</div>
<Modal title="Invite User" bind:open={addTicketModal}>
	<form>
		<div>
			<div>
				<Label for="email" class="mb-2" color="base">Email</Label>
				<Input size="full" type="email" id="email" required bind:value={email} />
				{#if emailError}
					<p class="error">{emailError}</p>
				{/if}
			</div>
			<div>
				<Label for="roleType" class="mb-2" color="base">Role</Label>
				<Select id="roleType" items={rolesMap} bind:value={selectedRole} />
			</div>
		</div>
	</form>
	<svelte:fragment slot="footer">
		<Button on:click={() => addAuthorizedUser()}>Invite</Button>
		<Button
			on:click={() => {
				addTicketModal = false;
				email = '';
				selectedRole = null;
			}}
			color="alternative">Cancel</Button
		>
	</svelte:fragment>
</Modal>
<Modal title="Delete Role" bind:open={deleteModalOpen}>
	<div class="text-center">
		<p class="text-gray-500 mt-2">
			Are you sure you want to delete the {deleteModalName} role? This action cannot be undone.
		</p>
	</div>
	<svelte:fragment slot="footer">
		<div class="flex justify-center space-x-4">
			<Button
				on:click={() => {
					deleteModalOpen = false;
				}}
				strokebtn
			>
				Cancel
			</Button>
			<Button on:click={() => deleteRole()} color="red">Delete</Button>
		</div>
	</svelte:fragment>
</Modal>

<style>
	.error {
		color: red;
		font-size: 0.875rem;
	}
</style>
