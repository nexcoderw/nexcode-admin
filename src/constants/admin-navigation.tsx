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

import { ROUTES } from './routes';

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
        href: ROUTES.admin.dashboard,
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
        href: ROUTES.admin.portfolios,
        icon: (
          <Icon
            icon={Briefcase01Icon}
            size={18}
          />
        ),
      },
      {
        label: 'Clients',
        href: ROUTES.admin.clients,
        icon: (
          <Icon
            icon={UserGroupIcon}
            size={18}
          />
        ),
      },
      {
        label: 'Team',
        href: ROUTES.admin.team,
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
        href: ROUTES.admin.blogs,
        icon: (
          <Icon
            icon={File01Icon}
            size={18}
          />
        ),
      },
      {
        label: 'Trainings',
        href: ROUTES.admin.trainings,
        icon: (
          <Icon
            icon={BookOpen01Icon}
            size={18}
          />
        ),
      },
      {
        label: 'Testimonials',
        href: ROUTES.admin.testimonials,
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
        href: ROUTES.admin.contacts,
        icon: (
          <Icon
            icon={Mail01Icon}
            size={18}
          />
        ),
      },
      {
        label: 'Payments',
        href: ROUTES.admin.payments,
        icon: (
          <Icon
            icon={CreditCardIcon}
            size={18}
          />
        ),
      },
      {
        label: 'Payment statuses',
        href: ROUTES.admin.paymentStatuses,
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
        href: ROUTES.admin.settings,
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