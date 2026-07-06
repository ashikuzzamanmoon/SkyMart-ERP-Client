import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
    { to: '/products', label: 'Products', icon: Package, roles: ['admin', 'manager', 'employee'] },
    { to: '/sales', label: 'Sales', icon: ShoppingCart, roles: ['admin', 'manager', 'employee'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">SkyMart ERP</h1>
        <button onClick={toggleSidebar} className="text-gray-600">
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-gray-200 h-auto md:h-screen sticky top-0 flex-shrink-0 z-10 shadow-sm md:shadow-none transition-all duration-300`}
      >
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-blue-600">SkyMart ERP</h1>
        </div>
        <nav className="mt-2 md:mt-6 px-4">
          <ul className="space-y-2">
            {navLinks
              .filter((link) => user && link.roles.includes(user.role))
              .map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      onClick={() => setIsSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-8 py-4 flex justify-end items-center sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors p-2 rounded-md hover:bg-red-50"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
