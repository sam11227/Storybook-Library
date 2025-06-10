<script>
  import { PieChart, Text } from "layerchart";
  import { format } from "d3-format";
  import { sum } from "d3-array";

  const data = [
    { fruit: "Online", value: 120, color: "#1F77E5" },
    { fruit: "Cash", value: 110, color: "#FF9F76" },
    { fruit: "Complimentary", value: 120, color: "#35D0D0" },
    { fruit: "Manual", value: 30, color: "#FF8DC7" },
  ];

  const series = data.map((d) => ({
    key: d.fruit,
    value: d.value,
    color: d.color,
  }));

  const numberFormat = format(",");
  const total = sum(data, (d) => d.value);
</script>

<div class="grid grid-cols-2 gap-8 mt-5">
  <div class="h-[225px] p-4">
    <PieChart {series} data={series} innerRadius={82} cornerRadius={1}
    ></PieChart>
  </div>

  <div class="flex flex-col justify-center gap-3">
    {#each data as item}
      <div class="flex items-center gap-4">
        <div
          class="w-3 h-3 rounded-full shrink-0"
          style="background-color: {item.color};"
        ></div>
        <span class="text-gray-600 min-w-[100px]">{item.fruit}</span>
        <span class="font-medium ml-auto">{item.value}</span>
      </div>
    {/each}
  </div>
</div>
