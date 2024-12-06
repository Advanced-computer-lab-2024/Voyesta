// NavBarTypes.ts

// Basic types for menu items
export type NavItemType = 'link' | 'dropdown' | 'button' | 'divider' | 'icon';

// Base interface for all nav items
export interface BaseNavItem {
  type: NavItemType;
  label: string;
  icon?: string;
  className?: string;
}

// Interface for simple links
export interface NavLink extends BaseNavItem {
  type: 'link';
  path: string;
  badge?: {
    count?: string;
    key?: string;
  };
}

// Interface for dropdown menu items
export interface DropdownItem {
  label: string;
  path: string;
  icon?: string;
}

// Interface for dropdown menus
export interface NavDropdown extends BaseNavItem {
  type: 'dropdown';
  items: DropdownItem[];
  showDelay?: number;
  hideDelay?: number;
}

// Interface for action buttons
export interface NavButton extends BaseNavItem {
  type: 'button';
  onClick: () => void;
}

// Interface for visual dividers
export interface NavDivider {
  type: 'divider';
}

// Interface for right-aligned icons with badges
export interface NavIcon extends BaseNavItem {
  type: 'icon';
  path: string;
  badge?: {
    count?: number;
    key?: string;
  };
  onClick?: () => void;
}

export interface ProfileMenuItem {
  label: string;
  path: string;
  icon?: string;
  onClick?: () => void;
}

export interface MobileMenuItem {
  label: string;
  path: string;
  icon?: string;
}

// Configuration for main navigation sections
export interface NavConfig {
  logo: {
    text: string;
    path?: string;
    image?: string;
  };
  centerItems?: (NavLink | NavDropdown | NavButton | NavDivider)[];
  rightIcons?: NavIcon[];
  profileMenu?: {
    items: ProfileMenuItem[];
    baseUrl: string;
  };
  mobileMenu?: {
    items: MobileMenuItem[];
    baseUrl: string;
  };
  dropdowns?: {
    [key: string]: {
      items: DropdownItem[];
      showDelay?: number;
      hideDelay?: number;
    };
  };
}

// Main configuration interface
export interface NavbarConfigs {
  [role: string]: NavConfig;
}