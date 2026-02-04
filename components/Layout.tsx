
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic2,
  Calendar,
  Users,
  Megaphone,
  DollarSign,
  LogOut,
  Menu,
  Cross,
  User as UserIcon,
  ShieldCheck,
  HeartHandshake,
  BarChart3,
  Globe
} from 'lucide-react';
import { useAuth } from '../App';
import { ROLE_PERMISSIONS, NAVIGATION_ITEMS } from '../constants';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout().then(() => navigate('/'));
  };

  if (!user) return null;

  const allowedItems = NAVIGATION_ITEMS.filter(item =>
    ROLE_PERMISSIONS[user.roleId]?.includes(item.id)
  );

  const icons: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard size={20} />,
    ShieldCheck: <ShieldCheck size={20} />,
    Mic2: <Mic2 size={20} />,
    Calendar: <Calendar size={20} />,
    HeartHandshake: <HeartHandshake size={20} />,
    Users: <Users size={20} />,
    Megaphone: <Megaphone size={20} />,
    DollarSign: <DollarSign size={20} />,
    BarChart3: <BarChart3 size={20} />,
    Globe: <Globe size={20} />
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out z-30
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center space-x-4 border-b border-slate-800">
            <img src="/logo.jpg" alt="Logo" className="h-12 w-auto object-contain bg-white rounded-lg p-1" />
            <div>
              <h1 className="font-bold text-sm leading-tight text-white uppercase tracking-tighter">Brotas de Macaúbas</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Painel Administrativo</p>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {allowedItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center space-x-3 p-3 rounded-lg transition-colors
                  ${(location.pathname === item.path) || (item.id !== 'dashboard' && location.pathname.startsWith(item.path))
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                {icons[item.icon]}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800 space-y-4 bg-slate-900/50">
            <div className="flex items-center space-x-3 px-2">
              <div className="bg-slate-700 p-2 rounded-full border border-slate-600">
                <UserIcon size={20} className="text-slate-300" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate text-white">{user.name}</p>
                <p className="text-[10px] uppercase font-black text-blue-400 tracking-wider">{user.roleId}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Sair do Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-8 justify-between sticky top-0 z-10 shadow-sm">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Visualizar Site</Link>
            <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
            <div className="hidden md:flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Sincronizado via Supabase Cloud</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
