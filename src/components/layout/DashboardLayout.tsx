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
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col
          md:sticky md:top-0 md:h-screen md:shadow-none md:transform-none md:flex-shrink-0 md:z-10
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isSidebarExpanded ? 'md:w-64' : 'md:w-20'}
        `}
      >
        <div className={`p-6 flex items-center ${isSidebarExpanded ? 'justify-start' : 'justify-center'}`}>
          <h1 className="text-2xl font-bold text-primary truncate transition-all duration-300">
            {isSidebarExpanded ? 'SkyMart ERP' : 'SM'}
          </h1>
        </div>
        <nav className="mt-2 md:mt-2 px-4 flex-1">
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

        {/* Mobile User Actions inside Drawer */}
        <div className="p-4 border-t md:hidden flex flex-col gap-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">{user?.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
            </div>
            <ThemeToggle />
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full text-red-500 hover:text-red-700 transition-colors p-2 rounded-md hover:bg-red-50 bg-red-50/50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Topbar */}
        <header className="bg-card shadow-sm border-b px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-10 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className="hidden md:flex text-muted-foreground hover:bg-muted p-2 rounded-md transition-colors"
              title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="md:hidden text-xl font-bold text-primary">SkyMart ERP</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-6">
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

            {/* Mobile Hamburger */}
            <button 
              onClick={toggleSidebar} 
              className="md:hidden text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
