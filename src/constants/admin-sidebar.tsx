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
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        description: 'Platform overview',
        href: ROUTES.admin.dashboard,
        exact: true,
        icon: (
          <Icon
            icon={DashboardSquare01Icon}
            size={20}
          />
        ),
      },
    ],
  },

  {
    label: 'Management',
    items: [
      {
        label: 'Portfolios',
        description: 'Projects & work',
        href: ROUTES.admin.portfolios,
        icon: (
          <Icon
            icon={Briefcase01Icon}
            size={20}
          />
        ),
      },
      {
        label: 'Clients',
        description: 'Client records',
        href: ROUTES.admin.clients,
        icon: (
          <Icon
            icon={UserGroupIcon}
            size={20}
          />
        ),
      },
      {
        label: 'Team',
        description: 'Team members',
        href: ROUTES.admin.team,
        icon: (
          <Icon
            icon={UserGroupIcon}
            size={20}
          />
        ),
      },
    ],
  },

  {
    label: 'Content',
    items: [
      {
        label: 'Blogs',
        description: 'Articles & drafts',
        href: ROUTES.admin.blogs,
        icon: (
          <Icon
            icon={File01Icon}
            size={20}
          />
        ),
      },
      {
        label: 'Trainings',
        description: 'Training programmes',
        href: ROUTES.admin.trainings,
        icon: (
          <Icon
            icon={BookOpen01Icon}
            size={20}
          />
        ),
      },
      {
        label: 'Testimonials',
        description: 'Client feedback',
        href: ROUTES.admin.testimonials,
        icon: (
          <Icon
            icon={StarIcon}
            size={20}
          />
        ),
      },
    ],
  },

  {
    label: 'Operations',
    items: [
      {
        label: 'Contacts',
        description: 'Website enquiries',
        href: ROUTES.admin.contacts,
        icon: (
          <Icon
            icon={Mail01Icon}
            size={20}
          />
        ),
      },
      {
        label: 'Payments',
        description: 'Project payments',
        href: ROUTES.admin.payments,
        icon: (
          <Icon
            icon={CreditCardIcon}
            size={20}
          />
        ),
      },
      {
        label: 'Payment statuses',
        description: 'Payment tracking',
        href: ROUTES.admin.paymentStatuses,
        icon: (
          <Icon
            icon={SecurityCheckIcon}
            size={20}
          />
        ),
      },
    ],
  },

  {
    label: 'System',
    items: [
      {
        label: 'Settings',
        description: 'Platform configuration',
        href: ROUTES.admin.settings,
        icon: (
          <Icon
            icon={Settings01Icon}
            size={20}
          />
        ),
      },
    ],
  },
];