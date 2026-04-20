import { motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const roleOptions = ['Recruiter', 'Hiring Manager', 'Talent Partner', 'Candidate'];

export function LoginPage() {
  const { auth } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setRememberedEmail] = useLocalStorage('smart-auth-email', auth.account.email);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Recruiter');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  const handleAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const signedIn = auth.signIn({ email, password });
    if (!signedIn) {
      setErrorMessage('Invalid email or password.');
      return;
    }

    if (rememberMe) {
      setRememberedEmail(email);
    }

    setErrorMessage('');
    navigate(from, { replace: true });
  };

  return (
    <div className="grid min-h-screen w-full place-items-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-100 via-white to-indigo-100 dark:bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] dark:from-neutral-900 dark:via-cyan-950 dark:to-gray-900 px-4 py-4 md:py-5">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-panel flex w-full max-w-[540px] flex-col overflow-hidden rounded-[1.5rem] p-3 md:p-4"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-teal-600 shadow-sm">
            ✓ Secure access
          </span>
        </div>

        <div className="mt-3 space-y-1.5">
          <h1 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">Sign in to Smart Jobs</h1>
          <p className="max-w-xl text-sm leading-5 text-slate-600 md:text-sm">
            Access your saved jobs, recruiter filters, and dashboard insights.
          </p>
        </div>

        <form className="mt-4 space-y-2" onSubmit={handleAuth}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="auth-email">
              Email
            </label>
            <Input
              id="auth-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="auth-password">
              Password
            </label>
            <Input
              id="auth-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="auth-role">
              Access Role
            </label>
            <Select id="auth-role" value={role} onChange={(event) => setRole(event.target.value)}>
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
            <input
              checked={rememberMe}
              className="h-4 w-4 rounded border-blue-100 bg-white text-blue-600 accent-blue-600"
              type="checkbox"
              onChange={(event) => setRememberMe(event.target.checked)}
            />
            Remember me
          </label>

          {errorMessage ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">{errorMessage}</p> : null}

          <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-110">
            ➔ Sign in
          </Button>
        </form>

        <p className="mt-3 text-center text-sm text-slate-600">
          New to the platform?{' '}
          <Link to="/signup" className="font-semibold text-blue-700 transition hover:text-blue-600">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}