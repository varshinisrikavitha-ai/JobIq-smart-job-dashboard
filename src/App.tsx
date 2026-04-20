import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { JobDetailsPage } from './pages/JobDetailsPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { auth } = useApp();

  if (!auth.user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

function AppRoutes() {
  const location = useLocation();
  const { auth } = useApp();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={auth.user ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={auth.user ? <Navigate to="/" replace /> : <SignupPage />}
        />
        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
          <Route path="/saved" element={<SavedJobsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <motion.div
        className="app-shell-bg min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AppRoutes />
      </motion.div>
    </AppProvider>
  );
}