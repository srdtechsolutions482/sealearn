
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input, Button, Textarea, UploadCloudIcon, FileIcon, TrashIcon, LockIcon } from '../components/ui';
import { Role } from '../types';

const LogoAnchorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="5" r="3"/></svg>;

const AuthLayout: React.FC<{children: React.ReactNode, title: string, subtitle?: string}> = ({children, title, subtitle}) => (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
        <div className="grid md:grid-cols-2 max-w-5xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden min-h-[600px]">
            <div className="hidden md:block relative">
                <img src="https://images.unsplash.com/photo-1505245996537-495777280bdc?q=80&w=1974&auto=format&fit=crop" alt="Container Ship" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-primary/20"></div>
            </div>
            <div className="p-10 flex flex-col justify-center">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-primary-dark leading-tight">{title}</h2>
                    {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                    {children}
                </div>
                <div className="mt-auto text-center text-xs text-text-tertiary pt-6">
                    <p>© 2024 SeaLearn Platform. All Rights Reserved.</p>
                    <p className="mt-1 text-accent-orange cursor-pointer hover:underline">Help & Support</p>
                </div>
            </div>
        </div>
    </div>
)

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);

    // Simulate a portal title change if user starts typing admin email
    const isAdmin = email.includes('admin');
    const title = isAdmin ? "Super Administrator Portal" : "Welcome Back, Seafarer";
    const subtitle = isAdmin ? "Welcome Back, Administrator" : "Enter your credentials to access your courses.";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const success = login(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid email or password.');
        }
    };

    return (
        <AuthLayout title={title} subtitle={subtitle}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <div className="text-danger bg-danger-bg p-3 rounded-lg text-sm text-center">{error}</div>}
                <Input label="Email Address" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@test.com" icon={<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>} required />
                <div className="relative">
                    <Input
                    label="Password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    icon={<LockIcon className="w-5 h-5" />}
                />
                {/* Manually positioned right icon (View/Eye) */}
                <button
                type="button"
                className="absolute right-3 top-[34px] text-text-tertiary hover:text-text-primary"
                onClick={() => setShowPassword(prev => !prev)}
                >
                {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
                ) : (
                    // Normal eye icon (eye open)
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
                </button>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                    <a href="#" className="text-accent-orange hover:underline ml-auto">Forgot Password?</a>
                </div>
                <Button type="submit" variant="primary-dark" className="w-full !py-3 !text-base mt-2">Login</Button>
            </form>
            {!isAdmin && (
             <p className="text-center text-sm text-text-secondary mt-6">
                Don't have an account? <Link to="/register" className="font-semibold text-primary-dark hover:underline">Sign Up</Link>
            </p>
            )}
        </AuthLayout>
    );
};
const RegisterPage: React.FC = () => {
    const [role, setRole] = useState<Role.USER | Role.VENDOR>(Role.USER);

    return (
        <div className="min-h-screen bg-secondary flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-border-color sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <LogoAnchorIcon />
                        <span className="text-lg font-bold text-text-primary">SeaLearn</span>
                    </Link>
                    <Link to="/login">
                         <Button variant="primary" size="sm" className="px-6">Login</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Role Toggle */}
                <div className="flex justify-center mb-10">
                     <div className="bg-white p-1 rounded-lg border border-border-color inline-flex shadow-sm">
                        <button onClick={() => setRole(Role.USER)} className={`px-6 py-2 rounded-md transition-all text-sm font-semibold ${role === Role.USER ? 'bg-primary-dark text-white shadow-md' : 'text-text-secondary hover:bg-gray-50'}`}>
                            Seafarer
                        </button>
                        <button onClick={() => setRole(Role.VENDOR)} className={`px-6 py-2 rounded-md transition-all text-sm font-semibold ${role === Role.VENDOR ? 'bg-primary-dark text-white shadow-md' : 'text-text-secondary hover:bg-gray-50'}`}>
                            Maritime Institute
                        </button>
                    </div>
                </div>

                {role === Role.USER ? (
                    <div className="grid md:grid-cols-2 gap-0 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
                         <div className="bg-primary-dark p-12 flex flex-col justify-center text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h1 className="text-4xl font-bold leading-tight mb-4">Your Voyage to Certification Starts Here.</h1>
                                <p className="text-gray-300 text-lg">Access DG Shipping-approved courses and advance your maritime career with our trusted platform.</p>
                            </div>
                            {/* Subtle background pattern */}
                            <svg className="absolute top-0 left-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                            </svg>
                        </div>
                        <div className="p-10 flex flex-col justify-center">
                            <h2 className="text-3xl font-bold text-text-primary mb-2">Create Your Seafarer Account</h2>
                            <p className="text-text-secondary mb-8">Join thousands of seafarers on their voyage to certification.</p>
                            <UserRegisterForm />
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                         <div className="text-center mb-10">
                            <h1 className="text-3xl font-extrabold text-text-primary">Register Your Maritime Institute</h1>
                            <p className="text-text-secondary mt-2">Join our platform to offer DG Shipping-approved courses to thousands of seafarers.</p>
                        </div>
                         <VendorRegisterForm />
                         <div className="mt-8 text-center">
                             <p className="text-sm text-text-secondary">
                                Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log In</Link>
                            </p>
                         </div>
                    </div>
                )}
            </main>

            <footer className="py-6 text-center text-sm text-text-tertiary">
                <div className="flex justify-center gap-6 mb-2">
                    <a href="#" className="hover:text-text-secondary">Terms of Service</a>
                    <a href="#" className="hover:text-text-secondary">Privacy Policy</a>
                    <a href="#" className="hover:text-text-secondary">Contact Us</a>
                </div>
            </footer>
        </div>
    );
};

const UserRegisterForm: React.FC = () => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [password, setPassword] = useState('');
return(
    <form className="space-y-5">
        <Input label="Full Name" id="name" placeholder="Enter your full name" type="text" required />
        <Input label="Email Address" id="email" placeholder="Enter your email address" type="email" required />
        <div className="grid grid-cols-2 gap-4">
             <Input label="Mobile Number" id="mobile" placeholder="+91 Enter your mobile number" type="tel" />
             <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Rank</label>
                <select className="w-full px-4 py-2.5 border border-border-color rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
                    <option>Select your rank</option>
                    <option>Deck Cadet</option>
                    <option>Captain</option>
                    <option>Chief Engineer</option>
                </select>
             </div>
        </div>
        {/* <div className="relative">
             <Input label="Password" id="password" placeholder="Create a strong password" type="password" required />
             <button type="button" className="absolute right-3 top-[34px] text-text-tertiary hover:text-text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
        </div> */}
        <div className="relative">
                    <Input
                    label="Password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                    icon={<LockIcon className="w-5 h-5" />}
                />
                {/* Manually positioned right icon (View/Eye) */}
                <button
                type="button"
                className="absolute right-3 top-[34px] text-text-tertiary hover:text-text-primary"
                onClick={() => setShowPassword(prev => !prev)}
                >
                {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
                ) : (
                    // Normal eye icon (eye open)
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
                </button>
            </div>
        <Button type="submit" variant="primary-dark" className="w-full !py-3 !text-base mt-2">Create My Account</Button>
        
        {/* <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border-color"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-text-secondary">Or sign up with</span>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border-color rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-text-primary">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-border-color rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-text-primary">
                <svg className="w-5 h-5 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
            </button>
        </div> */}
    </form>
);
}

const VendorRegisterForm: React.FC = () => (
    <form className="space-y-8">
        
        {/* Institute Information */}
        <section>
            <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-color">Institute Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Institute Name" id="instituteName" placeholder="Enter the full name of your institute" type="text" required />
                <Input label="Accreditation Number" id="accreditation" placeholder="Enter your official accreditation number" type="text" required />
            </div>
        </section>

        {/* Contact Details */}
        <section>
            <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-color">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <Input label="Contact Person" id="contactPerson" placeholder="Full name of primary contact" type="text" required />
                 <Input label="Email Address" id="email" placeholder="e.g., contact@institute.com" type="email" required />
            </div>
            <Textarea label="Address" id="address" placeholder="Enter the full physical address of the institute" required />
        </section>

        {/* Documentation */}
        <section>
             <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-color">Documentation</h3>
             <div className="border-2 border-dashed border-primary/30 rounded-lg p-10 bg-primary-light/10 text-center cursor-pointer hover:bg-primary-light/20 transition-colors">
                <div className="flex justify-center mb-3">
                    <UploadCloudIcon className="h-10 w-10 text-primary opacity-60" />
                </div>
                <p className="text-primary font-semibold">Click to upload <span className="text-text-secondary font-normal">or drag and drop</span></p>
                <p className="text-xs text-text-tertiary mt-1">PDF only (MAX. 5MB)</p>
             </div>
             
             {/* Mock Uploaded File */}
             <div className="mt-4 flex items-center justify-between p-3 bg-secondary rounded-lg border border-border-color">
                 <div className="flex items-center gap-3">
                     <FileIcon className="h-5 w-5 text-primary" />
                     <span className="text-sm font-medium text-text-primary">accreditation_document.pdf</span>
                 </div>
                 <button type="button" className="text-text-tertiary hover:text-danger">
                     <TrashIcon className="h-4 w-4" />
                 </button>
             </div>
        </section>

        <div className="pt-4">
             <Button type="submit" className="w-full !py-3 !text-base">Register</Button>
        </div>
    </form>
);


const AuthPages: React.FC = () => {
    const location = useLocation();
    
    // Auth pages now have their own layout, so we don't need a wrapper
    return location.pathname === '/login' ? <LoginPage /> : <RegisterPage />;
};

export default AuthPages;