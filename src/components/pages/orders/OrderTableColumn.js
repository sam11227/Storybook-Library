import Checkmark from "carbon-icons-svelte/lib/Checkmark.svelte";
import Badge from "../../Badges/Badge.svelte";
import Button from "../../Button/Button.svelte";


export const OrderTableColumn = [
  {
    key: "orderId",
    title: "ORDER ID",
    sortable: true,
    customRender: (value) => {
      return `<a href="http://localhost:8080/operator/venues/${value.venueID}/${value.eventID}/orders/${value.orderID}" class="text-brand-Primary font-medium">${value.orderID}</span>`;
    },
  },
  {
    key: "purchasedBy",
    title: "PURCHASED BY",
    customRender: (value) => {
      return `<div class="flex flex-col gap-1">
        <div class="text-sm text-gray-500 leading-[21px] font-normal">${value.name}</div>
        <span class="text-gray-400 text-[12px] leading-[18px]">${value.email}</span>
        </div>
        `;
    },
    sortable: true,
  },
  {
    key: "status",
    title: "STATUS",
    sortable: true,
    customRender: (value) => {

      if (value === "succeeded") {
        return `<span class="inline-block px-2 text-[12px] leading-[18px] font-semibold text-accent-success bg-accent-success/15 rounded-full">${value}</span>`;
      } else if (value === "Refunded" || value === "refundRequested" || value === "partially refunded") {
        return `<span class="inline-block px-2 text-[12px] leading-[18px] font-bold text-accent-Warning bg-accent-Warning/15 rounded-full">${value}</span>`;
      }
    },
  },
  {
    key: "dateOfPurchase",
    title: "DATE OF PURCHASE",
    sortable: true,
    customRender: (value) => {
      return `<div class="text-gray-500 text-sm leading-[21px] font-normal">${value}</div>`;
    },
  },
  {
    key: "quantity",
    title: "QUANTITY",
    sortable: true,
    customRender: (value) => {
      return `<div class="text-gray-500 text-sm leading-[21px] font-normal">${value}</div>`;
    },
  },
  {
    key: "saleType",
    title: "SALE TYPE",
    sortable: true,
    customRender: (value) => {
      return `<span class="inline-block px-2 text-[12px] leading-[18px]  font-semibold text-accent-success bg-accent-success/15 rounded-full">${value}</span>`;
    },
  },
  {
    key: "total",
    title: "TOTAL",
    sortable: true,
    customRender: (value) => {
      return `<span class="text-green-500 text-sm leading-[21px] font-normal">${value}</span>`;
    },
  },
  {
    key: "note",
    title: "NOTE",
    sortable: false,
    customRender: (value) => {
      return `<div class="text-gray-500 text-sm leading-[21px] font-normal italic">${value}</div>`;
    },
  },
];


export const AttendeeTableColumns = [
  {
    key: "attendeeName",
    title: "ATTENDEE NAME",
    sortable: true,
    customRender: (value) => {
      return `<div class="text-gray-500 text-sm font-normal">${value}</div>`;
    },
  },
  {
    key: "ticketType",
    title: "TICKET TYPE",
    sortable: true,
    customRender: (value) => {
      return `<div class=text-gray-500 text-sm font-normal">${value}</div>`;
    },
  },
  {
    key: "price",
    title: "PRICE",
    sortable: true,
    customRender: (value) => {
      return `<div class= "text-gray-500 text-sm font-normal">$${value}</div>`;
    },
  },
  {
    key: "status",
    title: "STATUS",
    sortable: true,
    isComponent: true,
    customRender: (value) => {
      if (value.isChecked && value.status) {
        return {
          component: Badge,
          props: {
            icon: Checkmark,
            status: value === "Refunded"
              ? "warning"
              : value === "Cancelled"
                ? "danger"
                : "success",
            className: "rounded-full px-2 text-gray-500 text-sm font-semibold",
            children: value.status
          }
        }
      } else {
        return {
          component: Button,
          props: {
            variant: "outline",
            children: value.status,
            onClick: () => dispatch('statusClick', { itemId: value.ID, setting: value.status === 'Check in' })

          }

        }
      }
    },
  }
];


export default { OrderTableColumn, AttendeeTableColumns }