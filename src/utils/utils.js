import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import BookingIcon from "../assets/svg/role/booking.svg";
import EmailIcon from "../assets/svg/role/emails.svg";
import EventIcon from "../assets/svg/role/event.svg";
import MarketingIcon from "../assets/svg/role/marketing.svg";
import OrdersIcon from "../assets/svg/role/orders.svg";
import OrganisationIcon from "../assets/svg/role/organisation.svg";
import PayoutIcon from "../assets/svg/role/payout.svg";
import ReportingIcon from "../assets/svg/role/reporting.svg";
import VenueIcon from "../assets/svg/role/venue.svg";
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export function convertToDate(value) {
  return value ? new Date(value).toDateString() : null
}
export const getDay = (dateString) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(dateString);
  return days[date.getUTCDay()];
};

export const getMonth = (dateString) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  return months[date.getUTCMonth()];
};

export const getDateOfMonth = (dateString) => {
  const date = new Date(dateString);
  return date.getUTCDate();
};

export function formatHour(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour} ${suffix}`;
}

export const formatDateTime = (dateTimeString, timeZone = "UTC") => {
  const options = {
    weekday: "short", // Mon, Tue, etc.
    year: "numeric", // 2024
    month: "short", // Dec
    day: "numeric", // 12
    hour: "numeric", // 11
    minute: "numeric", // 00
    hour12: true, // 11:00 PM format
    timeZone: timeZone, // Account for the timezone, defaults to 'UTC'
  };

  const date = new Date(dateTimeString);

  return new Intl.DateTimeFormat("en-US", options).format(date);
};

export const formatTimeline = (startDateTime) => {
  const formatHour = (date) => {
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const suffix = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${suffix}`;
  };

  const start = formatHour(new Date(startDateTime));
  return `${start}`;
};
export function truncateTitle(title, maxLength) {
  if (title.length > maxLength) {
    return title.slice(0, maxLength) + "...";
  }
  return title;
}

export function convertToCustomDateFormat(isoString) {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const customDate = new Date(year, month, day);

  return customDate;
}


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const ROLE_PERMISSION_LIST = [
  {
    icon: EventIcon,
    title: "Event creation",
    description:
      "Allow users to enter event info, create tickets & customize order forms",
    checkbox: [
      "Create Events",
      "Edit Event Details",
      "Manage event status",
      "Manage tickets",
      "Manage Collections",
    ],
  },
  {
    icon: BookingIcon,
    title: "Booking",
    description:
      "Allow users to manage performers, their invitations and statuses",
    checkbox: [
      "Access the roster page and view performer profiles",
      "Edit performer profiles",
      "Send booking invitations",
      "Manually confirm/decline performers to spots",
      "Send avails requests"
    ],
  },
  {
    icon: VenueIcon,
    title: "Venue creation",
    description: "Allow users to create new venues",
    checkbox: ["Add/edit/delete venues"],
  },
  {
    icon: MarketingIcon,
    title: "Marketing",
    description:
      "Sell more tickets by creating campaigns, tracking engagements, etc.",
    checkbox: [
      "Access social media posts",
      "Manage tracking links",
      "Manage promo codes",
    ],
  },
  {
    icon: OrdersIcon,
    title: "Orders & attendees",
    description:
      "Allow users to view, update & refund orders, manage attendee guest or waitlists & release tickets",
    checkbox: [
      "Add attendees",
      "Manage orders, refunds, transfers and attendees",
      "View list of attendees",
      "Check in attendees",
      "Resend confirmation emails",
      "Override ticket restrictions",
      "Sell tickets at the door",
      "Revoke and reissue barcodes",
    ],
  },
  {
    icon: OrganisationIcon,
    title: "Organization",
    description:
      "Keep your users organized with assigned permissions per user, enable access to APIs & extensions",
    checkbox: [
      "Manage organization members & permissions",
      "Edit organization infomation",
    ],
  },
  {
    icon: EmailIcon,
    title: "Contacts",
    description:
      "Keep our users in the loop, select which emails you would like them to receive",
    checkbox: [
      "Email attendees",
      "Email/SMS performers",
    ],
  },
  {
    icon: ReportingIcon,
    title: "Reporting",
    description:
      "Allow users to access, filter & export data across your organization",
    checkbox: [
      "Access reports pages",
    ],
  },
  {
    icon: PayoutIcon,
    title: "Payouts & billing",
    description:
      "Users can configure payout methods, manage event payment options & track financials with reporting",
    checkbox: [
      "Manage financial accounts (Stripe)"
    ],
  },
];