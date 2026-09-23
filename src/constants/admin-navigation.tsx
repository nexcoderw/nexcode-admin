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
} from '@hugeicons/core-free-icons';
import type { ReactNode } from 'react';

import { Icon } from '../components/ui/Icon/Icon';

import { ADMIN_ROUTES } from '@/constants/routes/admin-routes';
import { CLIENT_ROUTES } from '@/constants/routes/client-routes';
import { PORTFOLIO_ROUTES } from '@/constants/routes/portfolio-routes';
import { TEAM_ROUTES } from '@/constants/routes/team-routes';

export interface AdminNavigationItem {
  label: string;
  href: string;
  icon: ReactNode;
  exact?: boolean;
}

export interface AdminNavigationGroup {
  label: string;
  icon: ReactNode;
  items: AdminNavigationItem[];
}

export const ADMIN_NAVIGATION: AdminNavigationGroup[] = [
  {
    label: 'Dashboard',
    icon: (
      <Icon
        icon={DashboardSquare01Icon}
        size={16}
      />
    ),
    items: [
      {
        label: 'Dashboard',
        href: ADMIN_ROUTES.dashboard,
        exact: true,
        icon: (
          <Icon
            icon={DashboardSquare01Icon}
            size={18}
          />
        ),
      },
    ],
  },
  {
    label: 'Management',
    icon: (
      <Icon
        icon={Briefcase01Icon}
        size={16}
      />
    ),
    items: [
      {
        label: 'Portfolios',
        href: PORTFOLIO_ROUTES.list,
        icon: (
          <Icon
            icon={Briefcase01Icon}
            size={18}
          />
        ),
      },
      {
        label: 'Clients',
        href: CLIENT_ROUTES.list,
        icon: (
          <Icon
            icon={UserGroupIcon}
            size={18}
          />
        ),
      },
      {
        label: 'Team',
        href: TEAM_ROUTES.list,
        icon: (
          <Icon
            icon={UserGroupIcon}
            size={18}
          />
        ),
      },
    ],
  },
  {
    label: 'Content',
    icon: (
      <Icon
        icon={File01Icon}
        size={16}
      />
    ),
    items: [
      {
        label: 'Blogs',
        href: ADMIN_ROUTES.blogs,
        icon: (
          <Icon
            icon={File01Icon}
            size={18}
          />
        ),
      },
      {
        label: 'Trainings',
        href: ADMIN_ROUTES.trainings,
        icon: (
          <Icon
            icon={BookOpen01Icon}
            size={18}
          />
        ),
      },
      {
        label: 'Testimonials',
        href: ADMIN_ROUTES.testimonials,
        icon: (
          <Icon
            icon={StarIcon}
            size={18}
          />
        ),
      },
    ],
  },
  {
    label: 'Operations',
    icon: (
      <Icon
        icon={CreditCardIcon}
        size={16}
      />
    ),
    items: [
      {
        label: 'Contacts',
        href: ADMIN_ROUTES.contacts,
        icon: (
          <Icon
            icon={Mail01Icon}
            size={18}
          />
        ),
      },
      {
        label: 'Payments',
        href: ADMIN_ROUTES.payments,
        icon: (
          <Icon
            icon={CreditCardIcon}
            size={18}
          />
        ),
      },
      {
        label: 'Payment statuses',
        href: ADMIN_ROUTES.paymentStatuses,
        icon: (
          <Icon
            icon={SecurityCheckIcon}
            size={18}
          />
        ),
      },
    ],
  },
  {
    label: 'Settings',
    icon: (
      <Icon
        icon={Settings01Icon}
        size={16}
      />
    ),
    items: [
      {
        label: 'Settings',
        href: ADMIN_ROUTES.settings,
        icon: (
          <Icon
            icon={Settings01Icon}
            size={18}
          />
        ),
      },
    ],
  },
];