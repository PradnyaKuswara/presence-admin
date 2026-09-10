import React, { useState, useEffect } from 'react';
import { useUserData } from '../../hooks/useUserData';
import { useAuth } from '../../rests/useAuth';
import { getInitials } from '../../helpers/string'

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  badgeVariant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'slate';
}

export interface NavGroup {
  category?: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    category: 'Utama',
    items: [
      {
        label: 'Dashboard Overview',
        href: '/dashboard',
        icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      },
    ],
  },
  {
    category: 'Data Master',
    items: [
      {
        label: 'Data Sekolah',
        href: '/schools',
        icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m3 0h1m-1-4h.01M9 16h.01M9 12h.01M9 8h.01M15 16h.01M15 12h.01M15 8h.01',
        badge: '4 Active',
        badgeVariant: 'blue',
      },
      {
        label: 'Data Siswa',
        href: '/students',
        icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
        badge: '18.4k',
        badgeVariant: 'emerald',
      },
      {
        label: 'Tahun Ajaran',
        href: '/academic-years',
        icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      },
      {
        label: 'Kelas Sekolah',
        href: '/classes',
        icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      },
      {
        label: 'Jadwal Presensi',
        href: '/schedules',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      },
    ],
  },
  {
    category: 'Manajemen Sistem',
    items: [
      {
        label: 'Pengguna & Akses',
        href: '/users',
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      },
      {
        label: 'Notifikasi Telegram',
        href: '/telegram',
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      },
      {
        label: 'Pengaturan SaaS',
        href: '#',
        icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      },
    ],
  },
];

interface SidebarProps {
  currentPath?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [activePath, setActivePath] = useState<string>(currentPath);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const { user } = useUserData();
  const { logout: handleLogout, isLoggingOut } = useAuth();

  // Initialize collapse state from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sidebar_collapsed');
      if (stored !== null) {
        setIsCollapsed(stored === 'true');
      }
      if (!currentPath) {
        setActivePath(window.location.pathname);
      }
    }
  }, [currentPath]);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(nextState));
    }
  };

  return (
    <aside
      className={`sticky top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between md:flex shrink-0 transition-all duration-300 ease-in-out z-20 ${isCollapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Top Header & Logo */}
        <div className={`h-16 shrink-0 flex items-center border-b border-slate-200 dark:border-slate-800 px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <a href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-200">
                <h1 className="font-bold text-slate-900 dark:text-slate-100 text-base tracking-tight leading-tight">
                  Presence<span className="text-blue-600 dark:text-blue-400">SaaS</span>
                </h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wider uppercase font-semibold">Super Admin</p>
              </div>
            )}
          </a>

          {/* Toggle Button in Header when expanded */}
          {!isCollapsed && (
            <button
              onClick={toggleCollapse}
              title="Collapse Sidebar"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation Items (Independent Scroll) */}
        <nav className="p-3 space-y-5 overflow-y-auto flex-1 custom-scrollbar">

          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {/* Category Header */}
              {group.category && !isCollapsed && (
                <div className="px-3 pb-1.5 pt-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  {group.category}
                </div>
              )}
              {isCollapsed && groupIdx > 0 && (
                <div className="my-2 border-t border-slate-100 dark:border-slate-800/60 mx-2" />
              )}

              {/* Items list */}
              {group.items.map((item, itemIdx) => {
                const isActive =
                  activePath === item.href ||
                  (item.href !== '#' && activePath.startsWith(item.href));

                return (
                  <div
                    key={itemIdx}
                    className="relative group/tooltip"
                    onMouseEnter={() => setHoveredItem(item.label)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <a
                      href={item.href}
                      className={`relative flex items-center ${isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
                        } rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                          ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                    >
                      {/* Active Left Pill Accent Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-linear-to-b from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 rounded-r-full shadow-xs" />
                      )}

                      {/* Icon */}
                      <svg
                        className={`w-5 h-5 shrink-0 transition-colors ${isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-400 dark:text-slate-500 group-hover/tooltip:text-slate-700 dark:group-hover/tooltip:text-slate-200'
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={item.icon} />
                      </svg>

                      {/* Label & Badge when expanded */}
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 border ${item.badgeVariant === 'blue'
                                ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800/60'
                                : item.badgeVariant === 'emerald'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60'
                                  : item.badgeVariant === 'purple'
                                    ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800/60'
                                    : item.badgeVariant === 'amber'
                                      ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60'
                                      : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </a>

                    {/* Floating Tooltip in Collapsed Mode */}
                    {isCollapsed && hoveredItem === item.label && (
                      <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.2 rounded font-mono">
                            {item.badge}
                          </span>
                        )}
                        {/* Arrow tooltip */}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Section */}
      <div className="p-3 shrink-0 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-white dark:bg-slate-900">

        {/* Toggle Button if Collapsed */}
        {isCollapsed && (
          <button
            onClick={toggleCollapse}
            title="Expand Sidebar"
            className="w-full flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Profile Card */}
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'justify-between p-2.5'
            } rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 transition-all`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || 'User Avatar'}
                  className="w-8 h-8 rounded-lg object-cover shrink-0 shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs">
                  {getInitials(user.fullName)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            {!isCollapsed && (
              <div className="truncate min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {user.fullName || 'Super Admin'}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {user.email || 'superadmin@presence.id'}
                </p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              type="button"
              onClick={() => handleLogout()}
              disabled={isLoggingOut}
              title="Logout"
              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoggingOut ? (
                <svg className="w-4 h-4 animate-spin text-rose-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              )}
            </button>
          )}
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
