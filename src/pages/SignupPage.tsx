import { motion } from 'framer-motion';
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

const roleOptions = ['Recruiter', 'Hiring Manager', 'Talent Partner', 'Candidate'];

export function SignupPage() {
  const { auth } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [, setRememberedEmail] = useLocalStorage('smart-auth-email', auth.account.email);

  const [name, setName] = useState('Avery Morgan');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Recruiter');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  const handleSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (email.trim().length === 0) {
      setErrorMessage('Email is required.');
      return;
    }

    if (auth.account.email.trim().toLowerCase() === email.trim().toLowerCase()) {
      setErrorMessage('An account with this email already exists. Please sign in.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    auth.signUp({ name: name.trim(), email: email.trim(), role, password });

    if (rememberMe) {
      setRememberedEmail(email.trim());
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
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-600 shadow-sm">
            ✓ Start securely
          </span>
        </div>

        <div className="mt-3 space-y-1.5">
          <h1 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">Create your Smart Jobs account</h1>
          <p className="max-w-xl text-sm leading-5 text-slate-600 md:text-sm">
            Set up your profile to save jobs, manage preferences, and track your best matches.
          </p>
        </div>

        <form className="mt-4 space-y-2" onSubmit={handleSignup}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="signup-name">
              Full name
            </label>
            <Input
              id="signup-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Morgan"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="signup-email">
              Email
            </label>
            <Input
              id="signup-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="signup-password">
              Password
            </label>
            <Input
              id="signup-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="signup-role">
              Access Role
            </label>
            <Select id="signup-role" value={role} onChange={(event) => setRole(event.target.value)}>
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
            ➔ Create account
          </Button>
        </form>

        <p className="mt-3 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-700 transition hover:text-blue-600">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
