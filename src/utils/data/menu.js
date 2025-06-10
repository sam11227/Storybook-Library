export const menuLinks = [
  { label: "Home", href: "/operator", icon: "home-outline" },
  { label: "Events", href: "/operator/events", icon: "calendar-favorite-outline" },
  { label: "Performers", href: "/operator/rosters", icon: "performer-outline" },
  {
    label: "Sales",
    href: "/sales",
    icon: "sale-tag-outline",
    children: [
      { label: "Orders", href: "/operator/sales/orders" },
      { label: "Reports", href: "/operator/sales/reports" },
      { label: "Box office", href: "/operator/sales" },
      { label: "Promo codes", href: "/operator/promo-codes" },
      { label: "Gift cards", href: "/operator/sales/revenue" },
    ],
  },
  { label: "Notifications", href: "/operator/notifications", icon: "notification-outline" },
  { label: "Organization", href: "/operator/settings", icon: "grid-outline" },
  { label: "Help", href: "/operator/help", icon: "help-circle-outline" },
  { label: "Account settings", href: "/operator/profile", icon: "user-account", mobileOnly: true, },
  { label: "Sign out", href: "/auth/signout?userType=operator", icon: "sign-out", mobileOnly: true, },
];
