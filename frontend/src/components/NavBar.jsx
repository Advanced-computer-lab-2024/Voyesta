
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { NavConfig } from '../config/NavBarConfig';
import { BadgedIcon } from './nav/BadgedIcon';
import { ProfileDropdown } from './nav/ProfileDropdown';
import { MenuDropdown } from './nav/MenuDropdown';
import { NavTabs } from './nav/NavTabs';

function NavBar({ role = 'tourist', user }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownBVisible, setDropdownBVisible] = useState(false);
  const [dropdownEVisible, setDropdownEVisible] = useState(false);
  const [cartCount, setCartItems] = useState([]);
  const [wishlistCount, setWishlistItems] = useState([]);
  const [notifications, setNotifications] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const config = NavConfig[role];

  useEffect(() => {
    // Set active tab based on current path
    const path = location.pathname.split('/').pop();
    setActiveTab(path || 'home');
  }, [location]);

  const getAuthHeaders = () => {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  };

  const handleIconClick = (path) => {
    navigate(path);
  };

  const handleDropdownEnter = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [cartResponse, wishlistResponse, notiResponse] = await Promise.all([
          axios.get(`http://localhost:3000/api/tourist/getCart`, getAuthHeaders()),
          axios.get(`http://localhost:3000/api/tourist/ViewList`, getAuthHeaders()),
          axios.get(`http://localhost:3000/api/tourist/getUnreadNotifications`, getAuthHeaders())
        ]);

        setCartItems(cartResponse.data.length);
        setWishlistItems(wishlistResponse.data.wishlist.length);
        setNotifications(notiResponse.data.unreadCount);
      } catch (err) {
        console.error('Failed to fetch items:', err);
      }
    };

    fetchItems();
  }, []);

  return (
    <nav className="bg-white border-gray-200 dark:bg-navbar">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={assets.logo} className="h-8" alt="Voyesta Logo" />
          <span className="self-center text-2xl font-semibold text-gray-900 dark:text-background">
            {config.logo.text}
          </span>
        </div>

        {/* Center Items */}
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 ml-20">
          <ul className="flex flex-row font-medium space-x-8 mt-0">
            {config.centerItems?.map((item, index) => (
              <React.Fragment key={index}>
                {item.type === 'link' ? (
                  <li>
                    <button
                      onClick={() => handleIconClick(item.path)}
                      className={`block py-2 px-3 text-lg font-medium transition-all duration-300
                        ${activeTab === item.path.split('/').pop() 
                          ? 'text-blue-700 dark:text-background' 
                          : 'text-gray-900 dark:text-white hover:text-background dark:hover:text-background'}`}
                    >
                      {item.label}
                    </button>
                  </li>
                ) : (
                  <MenuDropdown
                    label={item.label}
                    items={item.items}
                    isVisible={activeDropdown === item.label}
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  />
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        {/* Right Icons */}
        <div className="flex items-center md:order-2 space-x-6">
          {config.rightIcons?.map((icon, index) => (
            <BadgedIcon
              key={index}
              icon={icon.icon}
              count={icon.badge ? eval(icon.badge.key) : 0}
              onClick={() => handleIconClick(icon.path)}
              className={`text-white dark:text-white ${
                activeTab === icon.path?.split('/').pop() 
                  ? 'text-white dark:text-white' 
                  : 'hover:text-background dark:hover:text-background'
              }`}
              items={icon.items}
            />
          ))}

          {role !=='admin' && (<ProfileDropdown
            user={user}
            isVisible={activeDropdown === 'profile'}
            items={config.profileMenu?.items || []}
            baseUrl={config.profileMenu?.baseUrl}
            onMouseEnter={() => handleDropdownEnter('profile')}
            onMouseLeave={handleDropdownLeave}
          />)}
        </div>


      </div>
    </nav>
  );
}

export default NavBar;





