import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingCart, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager'] },
    { to: '/products', label: 'Products', icon: Package, roles: ['admin', 'manager', 'employee'] },
    { to: '/sales', label: 'Sales', icon: ShoppingCart, roles: ['admin', 'manager', 'employee'] },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-card shadow-sm p-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold text-primary">SkyMart ERP</h1>
        <button onClick={toggleSidebar} className="text-muted-foreground hover:text-foreground">
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } md:block w-full ${isSidebarExpanded ? 'md:w-64' : 'md:w-20'} bg-card border-r border-border h-auto md:h-screen sticky top-0 flex-shrink-0 z-10 shadow-sm md:shadow-none transition-all duration-300 ease-in-out`}
      >
        <div className={`p-6 hidden md:flex items-center ${isSidebarExpanded ? 'justify-start' : 'justify-center'}`}>
          <h1 className="text-2xl font-bold text-primary truncate transition-all duration-300">
            {isSidebarExpanded ? 'SkyMart ERP' : 'SM'}
          </h1>
        </div>
        <nav className="mt-2 md:mt-2 px-4">
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
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted'
                        } ${!isSidebarExpanded ? 'md:justify-center px-0' : ''}`
                      }
                      title={!isSidebarExpanded ? link.label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className={`whitespace-nowrap transition-all duration-300 ${!isSidebarExpanded ? 'md:hidden' : 'block'}`}>
                        {link.label}
                      </span>
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
        <header className="bg-card shadow-sm border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="hidden md:flex text-muted-foreground hover:bg-muted p-2 rounded-md transition-colors"
              title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
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
