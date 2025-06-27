import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileBarChart2, LayoutDashboard, LogOut, UserCog, UtensilsCrossed } from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Manage Menu", icon: UtensilsCrossed, path: "/menu" },
  { name: "Create Invoice", icon: FileBarChart2, path: "/create-invoice" },
  { name: "Your Invoices", icon: UserCog, path: "/your-invoices" },
];

const AdminLayout = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  return (
    <div className="flex h-screen font-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed h-screen top-0 left-0 z-50">
        <div className="border-b border-gray-700 h-32  flex items-center justify-center">
          <img src="./src/assets/SLOGO.png" alt="Cafe Logo" className="object-cover" />
        </div>
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-3 py-2 rounded hover:bg-gray-700 ${location.pathname === item.path ? "bg-gray-700" : ""
                }`}
            >
              {item.icon && <item.icon className="inline-block mr-2" />}
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Buzz Cafe Billing System</h1>

          <div className="flex items-center">
            <span className="text-base font-semibold text-black mr-5">Welcome Admin..!</span>
          <Button
            onClick={handleLogout}
            className="text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors ml-2"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            Logout
          </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 overflow-auto h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
