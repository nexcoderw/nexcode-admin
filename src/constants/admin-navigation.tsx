import {
  BookOpen01Icon,
  Briefcase01Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  File01Icon,
  Mail01Icon,
  StarIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import type { ReactNode } from 'react';

import { Icon } from '../components/ui/Icon/Icon';

import { ADMIN_ROUTES } from '@/constants/routes/admin-routes';
import { CLIENT_ROUTES } from '@/constants/routes/client-routes';
import { CONTACT_ROUTES } from '@/constants/routes/contact-routes';
import { PORTFOLIO_ROUTES } from '@/constants/routes/portfolio-routes';
import { TEAM_ROUTES } from '@/constants/routes/team-routes';
import { PAYMENT_ROUTES } from './routes/payment-routes';

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
    label: 'Portfolios',
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
        exact: true,
        icon: (
          <Icon
            icon={Briefcase01Icon}
            size={18}
          />
        ),
      },
    ],
  },
  {
    label: 'Clients',
    icon: (
      <Icon
        icon={UserGroupIcon}
        size={16}
      />
    ),
    items: [
      {
        label: 'Portfolios',
        href: CLIENT_ROUTES.list,
        exact: true,
        icon: (
          <Icon
            icon={Briefcase01Icon}
            size={18}
          />
        ),
      },
    ],
  },
  {
    label: 'Team',
    icon: (
      <Icon
        icon={UserGroupIcon}
        size={16}
      />
    ),
    items: [
      {
        label: 'Team',
        href: TEAM_ROUTES.list,
        exact: true,
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
    label: 'Payments',
    icon: (
      <Icon
        icon={CreditCardIcon}
        size={16}
      />
    ),
    items: [
      {
        label: 'Payments',
        href: PAYMENT_ROUTES.list,
        exact: true,
        icon: (
          <Icon
            icon={CreditCardIcon}
            size={18}
          />
        ),
      },
      {
        label: 'Payment Reports',
        href: PAYMENT_ROUTES.reports,
        exact: true,
        icon: (
          <Icon
            icon={CreditCardIcon}
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
        href: CONTACT_ROUTES.list,
        icon: (
          <Icon
            icon={Mail01Icon}
            size={18}
          />
        ),
      },
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
];