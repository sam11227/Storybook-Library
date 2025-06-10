import type { TableColumn, TableProps } from './types'

export const basicTableColumn: TableColumn[] = [
  {
    key: 'name',
    title: 'Name',
    customRender: (value) => {
      return ` 
          <div class="w-full flex flex-row gap-2">
            <img class="rounded-full " src="https://picsum.photos/40/40" alt=${value} />
            <span class="my-auto">${value}</span>
          </div>`
    },
    visible: false
  },
  {
    key: 'ethnicity', title: 'Ethnicity', sortable: true,
    visible: false
  },
  {
    key: 'gender',
    title: 'Gender',
    sortable: true,
    customRender: (value) => {
      if (value === 'Male') {
        return `<span class="px-4 py-1 text-blue-600 bg-blue-300 rounded-full">${value}</span>`
      }
      return `<span class="px-4 py-1 text-purple-600 bg-purple-300 rounded-full">${value}</span>`
    },
    visible: false
  },
  {
    key: 'location', title: 'Location',
    visible: false
  },
  {
    key: 'tier',
    title: 'Tier',
    customRender: (value) => {
      return `<span class="px-4 py-1 text-white bg-blue-300 rounded-full">${value}</span>`
    },
    visible: false
  },
  {
    key: 'lastBookedDate', title: 'Last Booked Date',
    visible: false
  },
]

export const homeTableColumn: TableColumn[] = [
  {
    key: 'channel',
    title: 'Channel',
    visible: false
  },
  {
    key: 'sales', title: 'Sales', sortable: true,
    visible: false
  },
  {
    key: 'page_views',
    title: 'Page Views',
    sortable: true,
    visible: false
  },
  {
    key: 'tickets_sold', title: 'Tickets Sold', sortable: true,
    visible: false
  },
]

export const eventTableColumn: TableColumn[] = [
  {
    key: 'show',
    title: 'Show',
    visible: false
  },
  {
    key: 'performers', title: 'Performers',
    visible: false
  },
  {
    key: 'seats',
    title: 'Seats',
    visible: false
  },
  {
    key: 'type', title: 'Type',
    visible: false
  },
  {
    key: 'stage', title: 'Stage',
    visible: false
  },
  {
    key: 'status', title: 'Status',
    visible: false
  },
]

export const dummyData = [
  {
    channel: 'Twitter',
    sales: '$5450.88',
    page_views: '4053',
    tickets_sold: 294,
    'collapse-able': true,
    extraInfo: 'Extra information about Twitter',
  },
  {
    channel: 'Instagram',
    sales: '$5450.88',
    page_views: '4053',
    tickets_sold: 294,
  },
  {
    channel: 'Website',
    sales: '$5450.88',
    page_views: '4053',
    tickets_sold: 294,
  },
  {
    channel: 'The Comdey Bureau',
    sales: '$5450.88',
    page_views: '4053',
    tickets_sold: 294,
  },
  {
    channel: 'The Name of the show',
    sales: '$80.38',
    page_views: '4053',
    tickets_sold: 294,
  },
  {
    channel: 'Mignight Time',
    sales: '$0.00',
    page_views: '4053',
    tickets_sold: 294,
  },
]

// Mock data
export const table1Data = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
]
export const table1Columns = ['name', 'age']

export const table2Data = [
  { id: 1, product: 'Laptop', price: 1000 },
  { id: 2, product: 'Phone', price: 500 },
  { id: 3, product: 'Tablet', price: 300 },
]
export const table2Columns = ['product', 'price']
