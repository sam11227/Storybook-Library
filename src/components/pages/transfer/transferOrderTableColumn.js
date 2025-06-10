
export const EventTableColumns = [
  {
    key: "show",
    title: "SHOW",
    sortable: true,
    customRender: (value) => {
      return `<div class="flex items-center gap-6">
        <img src="${value.image}" alt="${value.name}" class="w-12 h-12 rounded-md" />
        <span class="text-Text-Secondary font-normal text-sm md:pr-4">${value.name}</span>
      </div>`;
    },
  },
  {
    key: "date",
    title: "DATE",
    sortable: true,
    customRender: (value) => {
      return `<div>
        <p class="text-Text-Tartiary font-normal text-sm">${value.date}</p>
        <p class="text-gray-400 text-xs">${value.day}</p>
      </div>`;
    },
  },
  {
    key: "time",
    title: "START TIME",
    sortable: true,
    customRender: (value) => {
      return `<div class="text-Text-Tartiary font-normal text-sm">${value}</div>`;
    },
  },
  {
    key: "club",
    title: "CLUB",
    sortable: true,
    customRender: (value) => {
      return `<div class="text-Text-Tartiary font-normal text-sm">${value}</div>`;
    },
  },
  {
    key: "capacity",
    title: "CAPACITY",
    sortable: true,
    customRender: (value) => {
      const percentage = value.current / value.total * 100;
      const color =
        percentage < 30
          ? "bg-red-500"
          : percentage < 70
          ? "bg-yellow-500"
          : "bg-green-500";

      return `<div class="gap-2 w-full pr-4">
      <div class="text-gray-500 font-normal text-xs flex justify-end">${value.current}/${value.total}</div>
        <div class="h-2 w-full bg-gray-200 rounded-full">
          <div class="h-2 ${color} rounded-full" style="width: ${percentage}%"></div>
        </div>
      </div>`;
    },
  },
];