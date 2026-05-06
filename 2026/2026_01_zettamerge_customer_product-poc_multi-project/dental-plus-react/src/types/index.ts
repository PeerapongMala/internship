import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  href: string;
  name: string;
  icon: LucideIcon;
}

export interface MenuSection {
  label: string;
  items: MenuItem[];
}

export interface MenuItems {
  headAdmin: MenuSection;
  admin: MenuSection;
  staffClinic: MenuSection;
}
