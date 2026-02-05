import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import {
  createHashRouter,
  RouterProvider,
  Navigate,
  Outlet
} from 'react-router-dom';
import { User, RoleType } from './types';
import { supabase } from './services/supabaseClient';
import PublicLanding from './pages/PublicLanding';
import AdminLayout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SermonsManager from './pages/SermonsManager';
import EventsManager from './pages/EventsManager';
import MembersManager from './pages/MembersManager';
import FinanceManager from './pages/FinanceManager';
import AnnouncementsManager from './pages/AnnouncementsManager';
import SocialActionsManager from './pages/SocialActionsManager';
import ReportsManager from './pages/ReportsManager';
import UsersManager from './pages/UsersManager';
import SettingsManager from './pages/SettingsManager';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

const ProtectedRoute: React.FC<{ roles?: RoleType[] }> = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.roleId)) return <Navigate to="/admin" replace />;

  return <Outlet />;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Dev/Manual session first
    const devUserStr = localStorage.getItem('eclesia_dev_user');
    if (devUserStr) {
      try {
        const devUser = JSON.parse(devUserStr);
        setUser(devUser);
        setLoading(false);
        // We still subscribe to auth changes in case user signs out from somewhere else
      } catch (e) {
        localStorage.removeItem('eclesia_dev_user');
      }
    }

    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('App: Initial session check:', session ? 'User logged in: ' + session.user.email : 'No session');
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'Usuário',
          roleId: (session.user.user_metadata?.role as RoleType) || RoleType.ADMIN // Default fallback
        });
      }
      if (!devUserStr) setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('App: Auth state change event:', event, session?.user?.email || 'No user');
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.full_name || 'Usuário',
          roleId: (session.user.user_metadata?.role as RoleType) || RoleType.ADMIN
        });
      } else if (!localStorage.getItem('eclesia_dev_user')) {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    localStorage.removeItem('eclesia_dev_user');
    await supabase.auth.signOut();
  };

  const router = useMemo(() => createHashRouter([
    { path: "/", element: <PublicLanding /> },
    { path: "/login", element: <Login /> },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        {
          element: <ProtectedRoute roles={[RoleType.ADMIN, RoleType.PASTOR_SENIOR]} />,
          children: [
            { path: "users", element: <UsersManager /> },
          ]
        },
        {
          element: <ProtectedRoute roles={[RoleType.ADMIN, RoleType.PASTOR_SENIOR, RoleType.EDITOR_SITE]} />,
          children: [
            { path: "settings", element: <SettingsManager /> }
          ]
        },
        {
          element: <ProtectedRoute roles={[RoleType.ADMIN, RoleType.PASTOR_SENIOR]} />,
          children: [{ path: "sermons", element: <SermonsManager /> }]
        },
        {
          element: <ProtectedRoute roles={[RoleType.ADMIN, RoleType.MISSIONARIA, RoleType.SECRETARIA, RoleType.PASTOR_SENIOR, RoleType.PRESBITERO, RoleType.DIACONO]} />,
          children: [{ path: "events", element: <EventsManager /> }]
        },
        {
          element: <ProtectedRoute roles={[RoleType.ADMIN, RoleType.MISSIONARIA, RoleType.PASTOR_SENIOR, RoleType.DIACONO]} />,
          children: [{ path: "social-actions", element: <SocialActionsManager /> }]
        },
        {
          element: <ProtectedRoute roles={[RoleType.ADMIN, RoleType.SECRETARIA, RoleType.PASTOR_SENIOR, RoleType.CONTADORA, RoleType.PRESBITERO, RoleType.DIACONO]} />,
          children: [{ path: "members", element: <MembersManager /> }]
        },
        {
          element: <ProtectedRoute roles={[RoleType.ADMIN, RoleType.CONTADORA, RoleType.PASTOR_SENIOR]} />,
          children: [
            { path: "finance", element: <FinanceManager /> },
            { path: "reports", element: <ReportsManager /> }
          ]
        },
        {
          element: <ProtectedRoute roles={[RoleType.ADMIN, RoleType.PASTOR_SENIOR, RoleType.SECRETARIA, RoleType.PRESBITERO]} />,
          children: [{ path: "announcements", element: <AnnouncementsManager /> }]
        }
      ]
    }
  ]), []);

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
};

export default App;
