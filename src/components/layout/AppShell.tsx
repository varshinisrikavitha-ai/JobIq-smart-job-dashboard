import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1600px] gap-4 px-3 py-4 md:gap-6 md:px-6 md:py-6">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <Topbar />
        <main className="flex-1 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}