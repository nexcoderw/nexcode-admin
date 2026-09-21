import {
  BookOpen01Icon,
  Briefcase01Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  File01Icon,
  Mail01Icon,
  SecurityCheckIcon,
  Settings01Icon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

import type { SidebarNavigationGroup } from "../components/layout/Sidebar/Sidebar";
import { Icon } from "../components/ui/Icon/Icon";

import { ROUTES } from "./routes";

export const ADMIN_SIDEBAR_NAVIGATION: SidebarNavigationGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: ROUTES.admin.dashboard,
        exact: true,
        icon: <Icon icon={DashboardSquare01Icon} size={20} />,
      },
    ],
  },

  {
    label: "Management",
    items: [
      {
        label: "Portfolios",
        href: ROUTES.admin.portfolios,
        icon: <Icon icon={Briefcase01Icon} size={20} />,
      },
      {
        label: "Clients",
        href: ROUTES.admin.clients,
        icon: <Icon icon={UserGroupIcon} size={20} />,
      },
      {
        label: "Team",
        href: ROUTES.admin.team,
        icon: <Icon icon={UserGroupIcon} size={20} />,
      },
    ],
  },

  {
    label: "Content",
    items: [
      {
        label: "Blogs",
        href: ROUTES.admin.blogs,
        icon: <Icon icon={File01Icon} size={20} />,
      },
      {
        label: "Trainings",
        href: ROUTES.admin.trainings,
        icon: <Icon icon={BookOpen01Icon} size={20} />,
      },
      {
        label: "Testimonials",
        href: ROUTES.admin.testimonials,
        icon: <Icon icon={StarIcon} size={20} />,
      },
    ],
  },

  {
    label: "Operations",
    items: [
      {
        label: "Contacts",
        href: ROUTES.admin.contacts,
        icon: <Icon icon={Mail01Icon} size={20} />,
      },
      {
        label: "Payments",
        href: ROUTES.admin.payments,
        icon: <Icon icon={CreditCardIcon} size={20} />,
      },
      {
        label: "Payment statuses",
        href: ROUTES.admin.paymentStatuses,
        icon: <Icon icon={SecurityCheckIcon} size={20} />,
      },
    ],
  },

  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: ROUTES.admin.settings,
        icon: <Icon icon={Settings01Icon} size={20} />,
      },
    ],
  },
];
