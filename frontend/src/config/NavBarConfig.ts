// src/config/TouristNavConfig.ts
import { NavbarConfigs } from '../types/NavBarTypes';
import { assets } from '../assets/assets';

export const NavConfig: NavbarConfigs = {
  tourist: {
    logo: {
      text: "Voyesta",
      path: "/tourist",
      image: assets.logo
    },
    centerItems: [
      {
        type: 'link',
        label: 'Museums',
        path: '/tourist/museums'
      },
      {
        type: 'link',
        label: 'Products',
        path: '/tourist/products'
      },
      {
        type: 'dropdown',
        label: 'Bookings',
        items: [
          { label: 'My Bookings', path: '/tourist/bookings' },
          { label: 'Book a Flight', path: '/tourist/flight' },
          { label: 'Book a Hotel', path: '/tourist/hotel' },
          { label: 'Book Transportation', path: '/tourist/transport' }
        ]
      },
      {
        type: 'dropdown',
        label: 'Events',
        items: [
          { label: 'Activities', path: '/tourist/activities' },
          { label: 'Itineraries', path: '/tourist/itineraries' }
        ]
      }
    ],
    rightIcons: [
      {
        type: 'icon',
        label: 'Home',
        path: '/tourist',
        icon: 'fa-home'
      },
      {
        type: 'icon',
        label: 'Notifications',
        path: '/tourist/notifications',
        icon: 'fa-bell',
        badge: {
          key: 'notifications'
        }
      },
      {
        type: 'icon',
        label: 'Cart',
        path: '/tourist/cart',
        icon: 'fa-shopping-cart',
        badge: {
          key: 'cartCount'
        }
      },
      {
        type: 'icon',
        label: 'Wishlist',
        path: '/tourist/Wishlist',
        icon: 'fa-heart',
        badge: {
          key: 'wishlistCount'
        }
      },
        {
            type: 'icon',
            label: 'Logout',
            path: '/',
            icon: 'fa-sign-out-alt',
            onClick: () => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }
        },
    ],
    profileMenu: {
      items: [
        { label: 'Profile', path: '/profile',  },
        { label: 'My Orders', path: '/orders',  },
        { label: 'Complaints', path: '/complaints', },
        { label: 'Purchases', path: '/purchases',}
      ],
      baseUrl: '/tourist'
    }
  },
  guest: {
    logo: {
      text: "Voyesta",
      path: "/",
      image: assets.logo
    },
    centerItems: [
      {
        type: 'link',
        label: 'Museums',
        path: '/guest/museums'
      },
      {
        type: 'dropdown',
        label: 'Events',
        items: [
          { label: 'Activities', path: '/guest/activities' },
          { label: 'Itineraries', path: '/guest/itineraries' }
        ]
      }
    ],
    rightIcons: [
      {
        type: 'icon',
        label: 'Home',
        path: '/',
        icon: 'fa-home'
      },
        {
            type: 'icon',
            label: 'Login',
            path: '/login',
            icon: 'fa-sign-in-alt'
        },
        {
            type: 'icon',
            label: 'Sign Up',
            path: '/signup',
            icon: 'fa-user-plus'
        }
    ],
    profileMenu: {
      items: [
        { label: 'Login', path: '/login', icon: 'fa-sign-in-alt' },
        { label: 'Sign Up', path: '/signup', icon: 'fa-user-plus' }
      ],
      baseUrl: '/'
    }
  }
};