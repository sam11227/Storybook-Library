<script>
	import Table from '../../src/components/Table/Table.svelte';
</script>

<div>
	<h1>Here we are render the storybook components for Test</h1>
	<Table
		keyField="id"
		searchable={false}
		paginated={{ status: false, totalPages: 0, pageSize: 0 }}
		hasActions
		hasCheckBox={true}
		bordered={true}
		isDraggable={true}
		classes=""
		columns={[
			{ key: 'name', title: 'Name' },
			{ key: 'ethnicity', title: 'Ethnicity', sortable: true },
			{ key: 'gender', title: 'Gender', sortable: true },
			{ key: 'location', title: 'Location' },
			{ key: 'tier', title: 'Tier' },
			{ key: 'lastBookedDate', title: 'Last Booked Date' }
		]}
		data={[
			{
				id: 6,
				name: 'Gus Naughton',
				ethnicity: 3,
				gender: 'Male',
				location: 0,
				tier: 1,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': true,
				extraInfo: 'Extra information about Gus Naughton'
			},
			{
				id: 7,
				name: 'Jim Jeffries',
				ethnicity: 3,
				gender: 'Male',
				location: 0,
				tier: 2,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': false,
				extraInfo: 'Extra information about Jim Jeffries'
			},
			{
				id: 8,
				name: 'Jon Rudnitsky',
				ethnicity: 4,
				gender: 'Male',
				location: 0,
				tier: 4,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': false,
				extraInfo: 'Extra information about Jon Rudnitsky'
			},
			{
				id: 9,
				name: 'Kevin Avery',
				ethnicity: 1,
				gender: 'Male',
				location: 0,
				tier: 5,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': false,
				extraInfo: 'Extra information about Kevin Avery'
			},
			{
				id: 10,
				name: 'Matt Fulchiron',
				ethnicity: 3,
				gender: 'Male',
				location: 0,
				tier: 3,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': true,
				extraInfo: 'Extra information about Matt Fulchiron'
			},
			{
				id: 11,
				name: 'Matt Kirshen',
				ethnicity: 3,
				gender: 'Male',
				location: 0,
				tier: 5,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': false,
				extraInfo: 'Extra information about Matt Kirshen'
			},
			{
				id: 12,
				name: 'Nicole Blaine',
				ethnicity: 3,
				gender: 'Female',
				location: 0,
				tier: 2,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': false,
				extraInfo: 'Extra information about Nicole Blaine'
			},
			{
				id: 13,
				name: 'Peet Guercio',
				ethnicity: 3,
				gender: 'Male',
				location: 0,
				tier: 1,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': true,
				extraInfo: 'Extra information about Peet Guercio'
			},
			{
				id: 14,
				name: 'Rory Scovel',
				ethnicity: 3,
				gender: 'Male',
				location: 0,
				tier: 1,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': true,
				extraInfo: 'Extra information about Rory Scovel'
			},
			{
				id: 15,
				name: 'Theo Von',
				ethnicity: 3,
				gender: 'Male',
				location: 0,
				tier: 1,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': true,
				extraInfo: 'Extra information about Theo Von'
			},
			{
				id: 16,
				name: 'Test User',
				ethnicity: 2,
				gender: 'Female',
				location: 0,
				tier: 2,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': false,
				extraInfo: 'Extra information about Test User'
			},
			{
				id: 17,
				name: 'Test User',
				ethnicity: 3,
				gender: 'Female',
				location: 1,
				tier: 3,
				lastBookedDate: 'Mon Jan 01 2001',
				'collapse-able': true,
				extraInfo: 'Extra information about Test User'
			}
		]}
	/>
</div>
