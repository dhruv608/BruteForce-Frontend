'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function SuperadminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/superadmin/login');
      router.refresh();
    } catch(e) {
      console.error(e);
    }
  };

  const links = [
    { label: 'Dashboard', path: '/superadmin', icon: 'dashboard' },
    { label: 'Admins', path: '/superadmin/admins', icon: 'admin_panel_settings' },
    { label: 'Cities', path: '/superadmin/cities', icon: 'location_city' },
    { label: 'Batches', path: '/superadmin/batches', icon: 'groups' }
  ];

  return (
    <aside className="h-screen sticky top-0 left-0 w-64 bg-surface-container-low border-r border-outline-variant/30 flex flex-col justify-between py-6 font-headline tracking-tight z-50">
      <div>
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container font-bold" style={{ fontVariationSettings: '"FILL" 1' }}>admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-container tracking-tighter">BruteForce</h1>
            <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Executive Portal</p>
          </div>
        </div>
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = link.path === '/superadmin' 
              ? pathname === '/superadmin' 
              : pathname.startsWith(link.path);

            return (
              <button 
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`w-full text-left flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                  isActive 
                    ? 'text-on-primary-container border-r-4 border-primary-container bg-primary-container/10 font-bold scale-95 active:scale-90' 
                    : 'text-outline hover:text-on-surface hover:bg-surface-container font-medium'
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={isActive ? { fontVariationSettings: '"FILL" 1' } : {}}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="space-y-1">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-3 text-error hover:bg-error/5 transition-all duration-200 text-left">
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
