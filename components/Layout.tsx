import React from 'react';
import { NavLink, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role, Vendor } from '../types';
import { Button, UsersIcon, SettingsIcon, LogoutIcon, DashboardIcon, CoursesIcon, VendorsIcon, ProfileIcon, SupportIcon, StudentsIcon } from './ui';

// --- ICONS ---
// FIX: Updated SearchIcon to accept a className prop.
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const FacebookIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Facebook</title><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>;
const TwitterIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>;
const LinkedInIcon = () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>;
const LogoAnchorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="5" r="3"/></svg>;

const PublicNavbar = () => {
  const { isAuthenticated } = useAuth();
  return (
    <header className="bg-white sticky top-0 z-40 border-b border-border-color">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <Link to="/" className="flex items-center gap-3">
          <LogoAnchorIcon />
          <span className="text-xl font-bold text-primary-dark">SeaLearn</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-md font-medium text-text-primary">
          <NavLink to="/courses" className={({isActive}) => `text-text-secondary hover:text-primary transition-colors ${isActive && 'text-primary font-semibold'}`}>Courses</NavLink>
          <NavLink to="/institutions" className={({isActive}) => `text-text-secondary hover:text-primary transition-colors ${isActive && 'text-primary font-semibold'}`}>Institutions</NavLink>
          <NavLink to="/about" className={({isActive}) => `text-text-secondary hover:text-primary transition-colors ${isActive && 'text-primary font-semibold'}`}>About Us</NavLink>
          <NavLink to="/contact" className={({isActive}) => `text-text-secondary hover:text-primary transition-colors ${isActive && 'text-primary font-semibold'}`}>Contact</NavLink>

        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input type="search" placeholder="Search" className="bg-secondary rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 w-48" />
          </div>
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant='primary'>My Dashboard</Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary-dark">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

const navItems = {
  [Role.USER]: [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { name: 'My Courses', href: '/dashboard/courses', icon: CoursesIcon },
    { name: 'Browse Courses', href: '/courses', icon: SearchIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: ProfileIcon },
  ],
  [Role.VENDOR]: [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { name: 'Manage Courses', href: '/dashboard/courses', icon: CoursesIcon },
    { name: 'Student Enquiries', href: '/dashboard/students', icon: StudentsIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: ProfileIcon },
  ],
  [Role.ADMIN]: [
    { name: 'Dashboard', href: '/dashboard', icon: DashboardIcon },
    { name: 'Vendor Management', href: '/dashboard/vendors', icon: VendorsIcon },
    { name: 'Course Management', href: '/dashboard/courses', icon: CoursesIcon },
    { name: 'User Management', href: '/dashboard/users', icon: UsersIcon },
  ],
};

const DashboardSidebar: React.FC = () => {
    const { role, user, logout } = useAuth();
    const navigate = useNavigate();

    if (!role || !user) return null;
    
    const items = navItems[role];
    const handleLogout = () => {
      logout();
      navigate('/');
    };
    
    const isVendor = user.role === Role.VENDOR;
    const vendor = user as Vendor;
    const instituteName = isVendor ? vendor.instituteName : 'Admin';

    return (
        <aside className="w-64 bg-white border-r border-border-color flex flex-col">
            <div className="h-20 flex items-center gap-3 px-6 border-b border-border-color">
              <LogoAnchorIcon />
              <span className="font-bold text-text-primary">Maritime.io</span>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
              {items.map(item => (
                <NavLink key={item.name} to={item.href} end={item.href.endsWith('/dashboard')} className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary-light text-primary' : 'text-text-secondary hover:text-primary hover:bg-secondary'}`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="px-4 py-6 border-t border-border-color">
              <nav className="space-y-2 mb-6">
                 <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-text-secondary hover:text-primary hover:bg-secondary">
                    <SettingsIcon className="w-5 h-5" />
                    <span>Settings</span>
                 </Link>
                 <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-text-secondary hover:text-danger hover:bg-red-50">
                    <LogoutIcon className="w-5 h-5" />
                    <span>Logout</span>
                 </button>
              </nav>
              
              <Link to="/dashboard/profile" className="flex items-center gap-3 px-2 pt-2 hover:bg-secondary rounded-lg p-2 transition-colors">
                  <img src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${user.name}&background=1D4ED8&color=fff`} alt="User avatar" className="h-10 w-10 rounded-full" />
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-text-primary truncate">{user.name}</p>
                    <p className="text-xs text-text-secondary truncate">{user.email}</p>
                  </div>
              </Link>
            </div>
        </aside>
    );
};

const Footer = () => (
    <footer className="bg-primary-dark text-gray-300 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div>
                     <Link to="/" className="flex items-center gap-3 mb-6">
                      <div className="bg-white p-1.5 rounded-lg">
                        <LogoAnchorIcon />
                      </div>
                      <span className="text-xl font-bold text-white">SeaLearn</span>
                    </Link>
                    <p className="text-sm text-gray-400 leading-relaxed">Empowering seafarers with world-class training. Your compass for career navigation at sea.</p>
                </div>
                <div>
                    <h5 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Quick Links</h5>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link to="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                        <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>
                 <div>
                    <h5 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Legal</h5>
                     <ul className="space-y-3 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">Connect</h5>
                     <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><TwitterIcon /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors"><LinkedInIcon /></a>
                    </div>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} SeaLearn. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

export const MainLayout: React.FC = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    if (isDashboard) {
        return (
            <div className="min-h-screen flex bg-secondary font-sans">
                <DashboardSidebar />
                <main className="flex-1 p-8 overflow-y-auto h-screen">
                    <Outlet />
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            <PublicNavbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};