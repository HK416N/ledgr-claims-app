import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ChevronRight, LogOut, Grid, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-[228px] bg-sidebar flex flex-col flex-shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-2 px-5 py-5">
                    <Grid size={18} className="text-white" />
                    <span className="text-white text-xs font-semibold tracking-widest uppercase">Expense Claim</span>
                </div>

                <div className="border-b border-white/10 mx-4" />

                {/* Nav */}
                <nav className="flex flex-col gap-1 mt-4 px-3 flex-1">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2 rounded text-sm text-white/80 hover:bg-sidebar-hover transition-colors
                            ${isActive ? 'bg-sidebar-hover text-white' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className="flex items-center gap-2">
                                    <LayoutDashboard size={16} />
                                    Dashboard
                                    {isActive && <ChevronRight size={14}></ChevronRight>}
                                </span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/history"
                        className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2 rounded text-sm text-white/80 hover:bg-sidebar-hover transition-colors
                                    ${isActive ? 'bg-sidebar-hover text-white' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className="flex items-center gap-2">
                                    <History size={16} />
                                    Claims History
                                    {isActive && <ChevronRight size={14}></ChevronRight>}
                                </span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/claims/new"
                        className={({ isActive }) =>
                            `flex items-center justify-between px-3 py-2 rounded text-sm text-white/80 hover:bg-sidebar-hover transition-colors
                            ${isActive ? 'bg-sidebar-hover text-white' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className="flex items-center gap-2">
                                    <PlusCircle size={16} />
                                    New Claim
                                    {isActive && <ChevronRight size={14}></ChevronRight>}
                                </span>
                            </>
                        )}
                    </NavLink>
                </nav>

                {/* User */}
                <div className="border-t border-white/10 mx-4" />
                <div className="px-4 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-white/50 text-xs truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="text-white/50 hover:text-white transition-colors flex-shrink-0">
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 bg-[#f0f4f8] overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default NavBar;