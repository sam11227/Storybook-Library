<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { createTableStore } from './stores/tableStore';
	import type { TableColumn, TableProps } from './types';

	import ExpandedRow from './ExpandedRow.svelte';
	import TableHead from './TableHead.svelte';
	import TablePagination from './TablePagination.svelte';
	import TableRow from './TableRow.svelte';
	import TableSearch from './TableSearch.svelte';
	import { cn } from './utils';

	let currentPage = 1;
	// Define searchQuery as a prop
	export let searchQuery: Writable<string> = writable('');

	export let isRounded: TableProps['isRounded'] = false;
	export let isDraggable: TableProps['isDraggable'] = false;
	export let bordered: TableProps['bordered'] = false;
	export let classes: TableProps['classes'] = '';
	export let searchable: TableProps['searchable'] = false;
	export let paginated: TableProps['paginated'] = {
		status: false,
		totalPages: 0,
		pageSize: 0
	};
	export let hasActions: TableProps['hasActions'] = false;
	export let hasCheckBox: TableProps['hasCheckBox'] = false;
	export let hasRadioButton: TableProps['hasRadioButton'] = false;
	export let data: any[] = [];
	export let columns: TableColumn[];
	export let keyField: TableProps['keyField'] = 'id';
	export let mobileView: string[] = [];
	export let showTableHead: TableProps['showTableHead'] = true;
	export let actionsContent: TableProps['actionContent'] = null;
	export let styles: TableProps['styles'] = {};
	export let takeToEventPage = false;
	export let isMobile = false;
	export let isTablet = false;
	export let isDesktop = false;

	$: screenSize = {
		isMobile,
		isTablet,
		isDesktop
	};
	const dispatch = createEventDispatcher();

	const updateMedia = () => {
		isMobile = window?.matchMedia('(max-width: 480px)').matches;
		isTablet = window?.matchMedia('(max-width: 768px) and (min-width: 481px)').matches;
		isDesktop = window?.matchMedia('(min-width: 769px)').matches;
	};

	// Create a local writable store for filtered data
	let filteredData: Writable<any[]> = writable(data);

	// Create table store
	const {
		sortedData,
		selectedRows,
		selectAll,
		expandedRows,
		sortData,
		filterData,
		toggleRowSelectionRadio,
		toggleRowSelection,
		toggleSelectAll,
		toggleRowExpansion,
		handleDragStart,
		handleDrop
	} = createTableStore(data, keyField);

	// Watch for changes in the search query and filter data accordingly
	$: {
		searchQuery.subscribe((value) => {
			// Filter data based on the search query
			const filtered = data.filter((row) => {
				return columns.some((column) => {
					const cellValue = row[column.key] ?? '';
					return cellValue.toString().toLowerCase().includes(value.toLowerCase());
				});
			});
			filteredData.set(filtered);
			filterData(value);
		});
	}

	// Reactive statement to filter columns based on device type
	$: filteredColumns = columns;
	// isMobile || isTablet
	//   ? columns.filter((column) => !mobileView.includes(column.key))
	//   : columns

	// Update on mount
	onMount(() => {
		sortedData.set([...data] || []);

		// Update on resize
		window.addEventListener('resize', updateMedia);
	});

	onDestroy(() => {
		// Cleanup the store when the component is destroyed
		searchQuery.set('');
	});
</script>

<div
	class={cn(
		`inline-flex flex-col justify-center items-center bg-white`,
		{
			'p-3 rounded-md ': isRounded
		},
		styles.container
	)}
>
	{#if searchable}
		<TableSearch style="p-3 rounded-md w-full" placeholder="Search..." bind:searchQuery />
	{/if}

	<table id="table" class={cn('w-[100%] text-sm text-left text-gray-500 bg-white', styles.table)}>
		{#if showTableHead}
			<TableHead
				theadStyle={styles.thead}
				thStyle={styles.th}
				{isDraggable}
				{bordered}
				columns={filteredColumns}
				{selectAll}
				{sortData}
				{toggleSelectAll}
				{hasActions}
				{hasCheckBox}
				{hasRadioButton}
				{mobileView}
				{screenSize}
			/>
		{/if}

		<tbody class={cn(styles.tbody)}>
			{#each $sortedData || [] as row, index}
				<TableRow
					tdStyle={styles.td}
					trStyle={styles.tr}
					{row}
					{index}
					{takeToEventPage}
					columns={filteredColumns}
					{selectedRows}
					{handleDragStart}
					{handleDrop}
					{toggleRowSelection}
					{toggleRowSelectionRadio}
					{toggleRowExpansion}
					{hasActions}
					{classes}
					{keyField}
					{bordered}
					{hasCheckBox}
					{hasRadioButton}
					{actionsContent}
					{isDraggable}
					{mobileView}
					{screenSize}
				/>

				<ExpandedRow
					tdStyle={styles.td}
					trStyle={styles.tr}
					hasActions
					{keyField}
					{expandedRows}
					{row}
					columns={filteredColumns}
				/>
			{/each}
		</tbody>
	</table>

	{#if paginated?.status}
		<TablePagination
			isPaginated={paginated.status}
			totalPages={+paginated.totalPages}
			pageSize={+paginated.pageSize}
			on:pageChange={(event) => {}}
			bind:currentPage
		/>
	{/if}
</div>
