import Badge from "../../Badges/Badge.svelte";
import Button from "../../Button/Button.svelte";
export const AttendeeTableColumns = [
  {
    key: "attendees",
    title: "ATTENDEE NAME",
    sortable: true,
    customRender: (value) => {
      return `<div class=" gap-2 pr-1">
        <div class="text-gray-500 font-normal text-sm">${value.name}</div>
        <span class="text-gray-400 font-normal text-sm">${value.email}</span>
      </div>`;
    },
  },
  {
    key: "orderId",
    title: "Order ID",
    sortable: true,
    customRender: (value) => {
      return `<div class="text-primary-500 text-sm font-normal">${value}</div>`;
    },
  },
  {
    key: "saleType",
    title: "Sale Type",
    sortable: true,
    customRender: (value) => {
      return `<span class="inline-block px-2 text-[12px] leading-[18px]  font-semibold text-accent-success bg-accent-success/15 rounded-full">${value}</span>`
    }
  },
  {
    key: "ticketId",
    title: "Ticket Id",
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
    key: "notes",
    title: "Notes",
    sortable: true,
    customRender: (value) => {
      return `<div class="text-gray-500 text-sm leading-[21px] font-normal italic">${value}</div>`;
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
          }

        }
      }
    },
  }
];



export let Attendees = [
  {
    id: 1,
    attendees: {
      name: "Darlene Robertson",
      email: "darlene.robertson@gmail.com",
    },
    orderId: "#490263029",
    saleType: "Online sale",
    ticketId: "487441449003",
    ticketType: "General Admission",
    notes: "",
    isChecked: true,
    status: "Checked in",
  },
  {
    id: 2,
    attendees: {
      name: "Leslie Alexander",
      email: "leslie.alexander@gmail.com",
    },
    orderId: "#504241699",
    saleType: "Complimentary",
    ticketId: "449003449003",
    ticketType: "VIP",
    notes: "Friends of the headliner. Needs special access",
    isChecked: true,
    status: "Checked in",
  },
  {
    id: 3,
    attendees: {
      name: "Arlene McCoy",
      email: "arlene.mccoy@protonmail.com",
    },
    orderId: "#58451953",
    saleType: "Online sale",
    ticketId: "553518267400",
    ticketType: "General Admission",
    notes: "",
    isChecked: false,
    status: "Check in",
  },
  {
    id: 4,
    attendees: {
      name: "Kristin Watson",
      email: "kristin.watson@hotmail.com",
    },
    orderId: "#53416093",
    saleType: "Complimentary",
    ticketId: "267400449003",
    ticketType: "General Admission",
    notes: "",
    isChecked: false,
    status: "Check in",
  },
  {
    id: 5,
    attendees: {
      name: "Eleanor Pena",
      email: "penanor@outlook.com",
    },
    orderId: "#58530365",
    saleType: "Complimentary",
    ticketId: "651535267400",
    ticketType: "General Admission",
    notes: "",
    isChecked: true,
    status: "Checked in",
  },
  {
    id: 6,
    attendees: {
      name: "Cody Fisher",
      email: "fisher.cody@yahoo.com",
    },
    orderId: "#72112136",
    saleType: "Cash",
    ticketId: "449003267400",
    ticketType: "Student",
    notes: "",
    isChecked: false,
    status: "Check in",
  },
  {
    id: 7,
    attendees: {
      name: "Robert Fox",
      email: "foxrob@aol.com",
    },
    orderId: "#72112136",
    saleType: "Online sale",
    ticketId: "267400267400",
    ticketType: "Student",
    notes: "",
    isChecked: false,
    status: "Check in",
  },
  {
    id: 8,
    attendees: {
      name: "Dianne Russell",
      email: "dianne@dianne.com",
    },
    orderId: "#21763156",
    saleType: "Online sale",
    ticketId: "558612449003",
    ticketType: "General Admission",
    notes: "",
    isChecked: true,
    status: "Checked in",
  },
  {
    id: 9,
    attendees: {
      name: "Jane Cooper",
      email: "jane.cooper@gmail.com",
    },
    orderId: "#31546464",
    saleType: "Complimentary",
    ticketId: "490003490000",
    ticketType: "VIP",
    notes: "Requires backstage access",
    isChecked: true,
    status: "Checked in",
  },
  {
    id: 10,
    attendees: {
      name: "Ronald Richards",
      email: "ronald.richards@outlook.com",
    },
    orderId: "#12646233",
    saleType: "Online sale",
    ticketId: "267400412345",
    ticketType: "General Admission",
    notes: "",
    isChecked: false,
    status: "Check in",
  },
];