<script>
	import { scaleOrdinal, scaleTime } from 'd3-scale';
	import { format as formatDate } from 'date-fns';
	import { Axis, Chart, Highlight, Spline, Svg, Tooltip } from 'layerchart';
	import { resize } from '../utils/utils';

	let dimensions = { width: 0, height: 0 };

	function handleResize(event) {
		dimensions = event;
	}

	const ChartData = [
		{ date: new Date(2025, 0, 1), value: 15000, category: 'Total Revenue' },
		{ date: new Date(2025, 0, 5), value: 12000, category: 'Total Revenue' },
		{ date: new Date(2025, 0, 9), value: 55000, category: 'Total Revenue' },
		{ date: new Date(2025, 0, 13), value: 2500, category: 'Total Revenue' },
		{ date: new Date(2025, 0, 17), value: 3500, category: 'Total Revenue' },
		{ date: new Date(2025, 0, 21), value: 20000, category: 'Total Revenue' },
		{ date: new Date(2025, 0, 25), value: 8000, category: 'Total Revenue' },
		{ date: new Date(2025, 0, 29), value: 5000, category: 'Total Revenue' },
		{ date: new Date(2025, 0, 31), value: 85000, category: 'Total Revenue' },

		{ date: new Date(2025, 0, 1), value: 5000, category: 'Previous Period' },
		{ date: new Date(2025, 0, 5), value: 70000, category: 'Previous Period' },
		{ date: new Date(2025, 0, 9), value: 5000, category: 'Previous Period' },
		{ date: new Date(2025, 0, 13), value: 68000, category: 'Previous Period' },
		{ date: new Date(2025, 0, 17), value: 52000, category: 'Previous Period' },
		{ date: new Date(2025, 0, 21), value: 18000, category: 'Previous Period' },
		{ date: new Date(2025, 0, 25), value: 6000, category: 'Previous Period' },
		{ date: new Date(2025, 0, 29), value: 35000, category: 'Previous Period' },
		{ date: new Date(2025, 0, 31), value: 12000, category: 'Previous Period' }
	];

	const chartDataByCategory = Object.entries(
		ChartData.reduce((acc, { category, ...rest }) => {
			acc[category] = acc[category] || [];
			acc[category].push(rest);
			return acc;
		}, {})
	);

	const categoryColors = {
		'Total Revenue': '#3B82F6',
		'Previous Period': '#3B82F6'
	};
</script>

<div class="space-y-4" use:resize={handleResize}>
	<div class="h-[301px]">
		<Chart
			data={ChartData}
			x="date"
			xScale={scaleTime()}
			y="value"
			yDomain={[0, 100000]}
			yNice
			c="category"
			cScale={scaleOrdinal()}
			cDomain={Object.keys(categoryColors)}
			cRange={Object.values(categoryColors)}
			padding={{ left: 48, bottom: 24, right: 24, top: 24 }}
			tooltip={{ mode: 'voronoi' }}
			let:cScale
		>
			<Svg>
				<Axis
					placement="left"
					rule
					grid={{
						stroke: '#E5E7EB',
						strokeWidth: '0.5px'
					}}
					ticks={[0, 20000, 40000, 60000, 80000, 100000]}
					format={(d) => `$${d.toLocaleString()}`}
				/>
				<Axis
					placement="bottom"
					format={(d) => formatDate(d, 'dd MMM')}
					rule
					ticks={dimensions.width >= 768
						? [
								new Date(2025, 0, 1),
								new Date(2025, 0, 5),
								new Date(2025, 0, 10),
								new Date(2025, 0, 15),
								new Date(2025, 0, 20),
								new Date(2025, 0, 25),
								new Date(2025, 0, 31)
						  ]
						: [new Date(2025, 0, 1), new Date(2025, 0, 15), new Date(2025, 0, 31)]}
				/>
				{#each chartDataByCategory as [category, data]}
					<Spline
						{data}
						stroke={cScale?.(category)}
						class="stroke-[2]"
						style="stroke-dasharray: {category === 'Previous Period'
							? '4,4'
							: 'none'}; opacity: {category === 'Previous Period' ? '0.5' : '1'}"
					/>
				{/each}
				<Highlight points lines />
			</Svg>

			<Tooltip.Root let:data>
				<Tooltip.Header>
					{formatDate(data.date, 'eee, MMM dd')}
				</Tooltip.Header>
				<Tooltip.List>
					<Tooltip.Item label={data.category} value={`$${data.value.toLocaleString()}`} />
				</Tooltip.List>
			</Tooltip.Root>
		</Chart>
	</div>

	<div class="flex items-center gap-4 pt-2">
		{#each Object.entries(categoryColors) as [category, color]}
			<div class="flex items-center gap-2">
				<div
					class="w-4 h-0.5"
					style="background-color: {color}; 
                 {category === 'Previous Period'
						? 'border-top: 2px dashed #3B82F6; background-color: transparent;'
						: ''}"
				/>
				<span class="text-sm text-gray-600">{category}</span>
			</div>
		{/each}
	</div>
</div>
