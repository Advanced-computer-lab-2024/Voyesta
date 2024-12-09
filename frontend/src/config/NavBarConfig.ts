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
        { label: 'Purchases', path: '/purchases',},
        {label: 'Help', path: '/help',}
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
        label: 'Get Started',
        path: '/guest/guide',
        icon: 'fa-map-signs' // Using Font Awesome travel/guide icon
      },
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
      baseUrl: 'http://localhost:5173'
    }
  },advertiser: {
    logo: {
      text: "Voyesta",
      path: "/advertiser",
      image: assets.logo
    },
    rightIcons: [
      {
        type: 'icon',
        label: 'Home',
        path: '/advertiser',
        icon: 'fa-home'
      },
      {
        type: 'icon',
        label: 'Notifications',
        path: '/advertiser/notifications',
        icon: 'fa-bell',
        badge: {
          key: 'notifications'
        }
      },
      {
        type: 'icon',
        label: 'Add Activity',
        path: '/advertiser/activity',
        icon: 'fa-plus'
      },
      {
        type: 'icon',
        label: 'Sales',
        path: '/advertiser/sales',
        icon: 'fa-chart-line'
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
      }
    ],
    profileMenu: {
      items: [
        { label: 'Profile Management', path: '/profile', icon: 'fa-user-cog' },
        { 
          label: 'Logout', 
          path: '/',
          icon: 'fa-sign-out-alt',
          onClick: () => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }
        }
      ],
      baseUrl: '/advertiser'
    }
  },seller: {
    logo: {
      text: "Voyesta",
      path: "/seller",
      image: assets.logo
    },
    centerItems: [
      {
        type: 'link',
        label: 'View All Products',
        path: '/seller/view-products'
      }
    ],
    rightIcons: [
      {
        type: 'icon',
        label: 'Home',
        path: '/seller',
        icon: 'fa-home'
      },
      {
        type: 'icon',
        label: 'Create Product',
        path: '/seller/create-product',
        icon: 'fa-plus'
      },
      {
        type: 'icon',
        label: 'Sales',
        path: '/seller/sales',
        icon: 'fa-chart-line'
      },
      {
        type: 'icon',
        label: 'Notifications',
        path: '/seller/notifications',
        icon: 'fa-bell',
        badge: {
          key: 'notifications'
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
      }
    ],
    profileMenu: {
      items: [
        { label: 'Profile Management', path: '/profile', icon: 'fa-user-cog' },
        { label: 'My Products', path: '/view-my-products', icon: 'fa-box' }
      ],
      baseUrl: '/seller'
    }
  },tourismGovernor: {
    logo: {
      text: "Voyesta",
      path: "/tourismGovernor",
      image: assets.logo
    },
    centerItems: [],
    rightIcons: [
      {
        type: 'icon',
        label: 'Home',
        path: '/tourismGovernor',
        icon: 'fa-home'
      },
      {
        type: 'icon',
        label: 'Add Places of Interest',
        path: '/tourismGovernor/places-of-interest',
        icon: 'fa-plus'
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
      }
    ],
    profileMenu: {
      items: [
        { label: 'Profile', path: '/account-list', icon: 'fa-user' }
      ],
      baseUrl: '/tourismGovernor'
    }
  },
  tourguide: {
    logo: {
      text: "Voyesta",
      path: "/tourguide",
      image: assets.logo
    },
    centerItems: [
      {
        type: 'link',
        label: 'Museums',
        path: '/tourguide/museums'
      },
      {
        type: 'link',
        label: 'Activities',
        path: '/tourguide/activities'
      }
    ],
    rightIcons: [
      {
        type: 'icon',
        label: 'Home',
        path: '/tourguide',
        icon: 'fa-home'
      },
      {
        type: 'icon',
        label: 'Add',
        path: '/tourguide/itineraries',
        icon: 'fa-plus'
      },
      {
        type: 'icon',
        label: 'Notifications',
        path: '/tourguide/notifications',
        icon: 'fa-bell',
        badge: {
          key: 'notifications'
        }
      },
      {
        type: 'icon',
        label: 'Sales',
        path: '/tourguide/sales',
        icon: 'fa-chart-line'
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
      }
    ],
    profileMenu: {
      items: [
        { label: 'Profile', path: '/profile', icon: 'fa-user' }
      ],
      baseUrl: '/tourguide'
    }
  }, admin: {
    logo: {
      text: "Voyesta Admin",
      path: "/admin",
      image: assets.logo
    },
    centerItems: [
      {
        type: 'link',
        label: 'Products',
        path: '/admin/products'
      },
      {
        type: 'dropdown',
        label: 'Events',
        items: [
          { label: 'Activities', path: '/admin/activities' },
          { label: 'Itineraries', path: '/admin/itineraries' }
        ]
      },
      {
        type: 'link',
        label: 'Complaints',
        path: '/admin/complaints'
      }
    ],
    rightIcons: [
      {
        type: 'icon',
        label: 'Home',
        path: '/admin',
        icon: 'fa-home'
      },
      {
        type: 'icon',
        label: 'Notifications',
        path: '/admin/notifications',
        icon: 'fa-bell',
        badge: {
          key: 'notifications'
        }
      },
      {
        type: 'icon',
        label: 'Sales',
        path: '/admin/revenue-sales',
        icon: 'fa-chart-line'
      },
      {
        type: 'icon',
        label: 'Site Management',
        icon: 'fa-cogs',
        items: [
          { label: 'Account Management', path: '/admin/account-management' },
          { label: 'Manage Preference Tags', path: '/admin/preference-tag' },
          { label: 'Manage Categories', path: '/admin/activity-category' },
          { label: 'Pending Users', path: '/admin/pendingUsers' },
          { label: 'User Stats', path: '/admin/user-stats' },
          { label: 'Promo Codes', path: '/admin/promo-codes' }
        ]
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
      }
    ],
  }


};