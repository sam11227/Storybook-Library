<script lang="ts">
	import { Checkbox, Dropdown, DropdownItem, Radio } from 'flowbite-svelte';
	import { DotsHorizontalOutline } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import SwipeListener from 'swipe-listener';
	import { cn } from '../../lib/tableUtils';
	import type { DropdownMenuItem, TableColumn, TableProps } from './types';

	export let tdStyle;
	export let trStyle;
	export let classes: TableProps['classes'];
	export let keyField: TableProps['keyField'];
	export let bordered: TableProps['bordered'];
	export let hasCheckBox: TableProps['hasCheckBox'] = false;
	export let hasRadioButton: TableProps['hasRadioButton'] = false;
	export let hasActions: TableProps['hasActions'] = false;
	export let columns: TableColumn[];
	export let isDraggable: TableProps['isDraggable'];
	export let row;
	export let index;
	export let selectedRows;
	export let handleDragStart;
	export let handleDrop;
	export let toggleRowExpansion;
	export let toggleRowSelection;
	export let toggleRowSelectionRadio;
	export let onClickRow;
	export let mobileView;
	export let screenSize: TableProps['screenSize'];
	export let onSelectDropDown: (value: string) => void = () => {};
	export let actionsContent; // Slot for custom actions
	export let dropdownItems: DropdownMenuItem[] = [];

	function handleCheckboxChange(event) {
		event.stopPropagation(); // Stop the event from bubbling up to the row
	}

	function handleDropdownClick(event) {
		event.stopPropagation(); // Prevent the event from bubbling up to the row
	}

	function handleKeydown(event: KeyboardEvent) {
		const { key } = event;
		switch (key) {
			case 'ArrowRight':
				// Move to the next cell
				const nextCell = (event.target as HTMLElement).nextElementSibling;
				if (nextCell) (nextCell as HTMLElement)?.focus();
				break;
			case 'ArrowLeft':
				// Move to the previous cell
				const prevCell = (event.target as HTMLElement).previousElementSibling;
				if (prevCell) (prevCell as HTMLElement)?.focus();
				break;
			case 'ArrowDown':
				// Move to the next row
				const nextRow = (event.target as HTMLElement).parentElement?.nextElementSibling;
				if (nextRow) (nextRow.children[0] as HTMLElement).focus();
				break;
			case 'ArrowUp':
				// Move to the previous row
				const prevRow = (event.target as HTMLElement).parentElement?.previousElementSibling;
				if (prevRow) (prevRow.children[0] as HTMLElement).focus();
				break;
		}
	}

	function swipeFunc(container, parentElement) {
		var listener = SwipeListener(container);
		container.addEventListener('swipe', function (e) {
			var directions = e.detail.directions;
			if (directions.left) {
				const buttonContainer = parentElement.querySelector('#button-container') as HTMLElement;
				buttonContainer.style.display = 'flex';
			}
			if (directions.right) {
				const buttonContainer = parentElement.querySelector('#button-container') as HTMLElement;
				buttonContainer.style.display = 'none';
			}
		});
	}

	onMount(() => {
		const swiper = document.querySelectorAll('#swipe-container');
		swiper.forEach((element: HTMLElement) => {
			const parentElement = element.parentElement; // Get the parent element
			swipeFunc(element, parentElement);
		});
	});
</script>

<tr
	tabindex="0"
	on:keydown={handleKeydown}
	class={cn(
		'bg-white hover:bg-gray-50',
		classes,
		{
			'bg-blue-100 text-black': $selectedRows.has(row[keyField]),
			'border-b': bordered
		},
		trStyle
	)}
	draggable={row.draggable || isDraggable}
	on:dragstart={(event) => handleDragStart(index)}
	on:dragover={(event) => event.preventDefault()}
	on:drop={(event) => handleDrop(index)}
	on:click={() => row['collapse-able'] && toggleRowExpansion(row[keyField])}
>
	{#if hasCheckBox}
		<td
			tabindex="0"
			on:keydown={handleKeydown}
			class={cn('!pl-4', tdStyle)}
			on:click={handleCheckboxChange}
		>
			<Checkbox
				id={`checkbox-${row[keyField]}`}
				on:change={() => toggleRowSelection(row[keyField])}
				checked={$selectedRows.has(row[keyField])}
				role="checkbox"
			/>
		</td>
	{/if}

	{#if hasRadioButton}
		<td
			tabindex="0"
			on:keydown={handleKeydown}
			class={cn('!p-4', tdStyle)}
			on:click={handleCheckboxChange}
		>
			<Radio
				name="table-radio-button"
				on:change={() => toggleRowSelectionRadio(row[keyField])}
				checked={$selectedRows.has(row[keyField])}
			/>
		</td>
	{/if}

	{#if row.draggable || isDraggable}
		<td class={cn('!p-4', tdStyle)} tabindex="0" on:keydown={handleKeydown}>
			<img class="m-auto" src={'/assets/svg/sort-icon.svg'} alt="" />
		</td>
	{/if}

	<!-- Main columns visible based on screen size -->
	{#each columns as column}
		{#if !screenSize.isMobile || !mobileView.includes(column.key)}
			<td
				tabindex="0"
				on:keydown={handleKeydown}
				on:click={() => onClickRow && onClickRow(row)}
				class={cn(
					'pl-2 py-2',
					// "px-6 py-2",
					{
						'border-r': bordered
					},
					tdStyle
				)}
			>
				{#if column.isComponent && column.customRender(row[column.key])}
					{@const renderData = column.customRender(row)}
					<svelte:component
						this={renderData && renderData.component}
						{...(({ children, ...props }) => props)(renderData.props)}
					>
						{renderData.props.children}
					</svelte:component>
				{:else if !column.isComponent && column.customRender}
					{@html column.customRender(row[column.key])}
				{:else}
					{row[column.key]}
				{/if}
			</td>
		{/if}
	{/each}

	{#if hasActions}
		<td
			tabindex="0"
			on:keydown={handleKeydown}
			class={cn('!p-4', tdStyle, {
				'border-r': bordered
			})}
			on:click={handleDropdownClick}
		>
			{#if actionsContent}
				{@html actionsContent}
			{:else}
				<DotsHorizontalOutline
					data-testid="dropdown-menu"
					triggeredBy=".dots-menu"
					class="dots-menu dark:text-white"
				/>
				<Dropdown class="shadow-none min-w-[200px]" triggeredBy=".dots-menu">
					{#each dropdownItems as item}
						<DropdownItem
							on:click={() => onSelectDropDown(item.action)}
							class={cn(
								'flex items-center gap-2 no-underline hover:no-underline font-normal',
								item.className
							)}
						>
							{#if item.icon}
								{#if item.iconType === 'image'}
									<img src={item.icon} alt={item.alt} class="font-normal" />
								{:else if item.iconType === 'component'}
									<svelte:component this={item.icon} size={16} />
								{/if}
							{/if}
							{item.label}
						</DropdownItem>
					{/each}
				</Dropdown>
			{/if}
		</td>
	{/if}
</tr>

{#if screenSize.isMobile && mobileView.length > 0}
	<tr class={cn('bg-white', trStyle)}>
		<td
			colspan={columns.length +
				(hasCheckBox ? 1 : 0) +
				(hasRadioButton ? 1 : 0) +
				(hasActions ? 1 : 0)}
		>
			<div class="wrapper">
				<div
					id={`swipe-container`}
					data-testid="swipe-container"
					class="swipe-container flex gap-1 swipe-column"
				>
					{#each columns as column, key}
						{#if mobileView.includes(column.key)}
							<div class={cn('py-2', { 'border-b': bordered })}>
								<strong>{column.title}: </strong>{row[column.key]}
							</div>
						{/if}
					{/each}
				</div>
				<div id="button-container" class="button-container">
					<button class="bg-blue-700 text-white px-6" on:click={() => alert('edit')}>Edit</button>
					<button class="bg-red-700 text-white px-6" on:click={() => alert('delete')}>Delete</button
					>
				</div>
			</div>
		</td>
	</tr>
{/if}
