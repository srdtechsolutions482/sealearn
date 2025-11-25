import React, { useState, useMemo } from 'react';
import { Routes, Route, useParams, Link, useNavigate } from 'react-router-dom';
import { courses, vendors } from '../data';
import { Status } from '../types';
import CourseCard from '../components/CourseCard';
import { Button, Input, Card, StatusBadge, WaveIcon, AnchorIcon, PoseidonIcon, RudderIcon, Textarea, Badge, Slider, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon } from '../components/ui';

const TrophyIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-accent-yellow"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;

const HomePage: React.FC = () => (
  <div className="bg-secondary">
    {/* Hero Section */}
    <section className="relative bg-primary-dark h-[600px]">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1559024926-751d3b13e873?q=80&w=2070&auto=format&fit=crop" alt="Cargo ship on the ocean" className="w-full h-full object-cover opacity-30" />
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-start text-white">
        <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">Upgrade Your Maritime Skills</h1>
            <p className="text-xl text-gray-200 mb-8 font-light">Find DG Shipping–approved courses from top institutes. Enhance your career with our comprehensive training platform.</p>
            <Link to="/courses">
                <Button variant="accent" className="text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">Explore All Courses</Button>
            </Link>
        </div>
      </div>
    </section>

    {/* Stats Section - Floating Cards */}
    <section className="relative z-10 -mt-16 px-4">
        <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="!p-8 shadow-lg border-0 transform hover:-translate-y-1 transition-all duration-300">
                    <p className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-1">DG Shipping Approved</p>
                    <div className="text-4xl font-extrabold text-primary-dark">100%</div>
                </Card>
                <Card className="!p-8 shadow-lg border-0 transform hover:-translate-y-1 transition-all duration-300">
                    <p className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-1">Available Courses</p>
                    <div className="text-4xl font-extrabold text-primary-dark">100+</div>
                </Card>
                <Card className="!p-8 shadow-lg border-0 transform hover:-translate-y-1 transition-all duration-300">
                    <p className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-1">Certified Instructors</p>
                    <div className="text-4xl font-extrabold text-primary-dark">Verified</div>
                </Card>
            </div>
        </div>
    </section>

    {/* Featured Courses */}
    <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-text-primary mb-10">Featured Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {courses.slice(0, 4).map(course => <CourseCard key={course.id} course={course} />)}
            </div>
        </div>
    </section>

    {/* Top Institutions */}
    <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-text-primary mb-10">Top Institutions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="flex flex-col items-center justify-center text-center !p-10 hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="p-5 bg-blue-50 rounded-full mb-6"><WaveIcon className="w-8 h-8 text-primary"/></div>
                    <h3 className="font-bold text-lg text-text-primary">BlueWave Maritime</h3>
                    <p className="text-sm text-text-secondary">Mumbai, India</p>
                </Card>
                 <Card className="flex flex-col items-center justify-center text-center !p-10 hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="p-5 bg-blue-50 rounded-full mb-6"><AnchorIcon className="w-8 h-8 text-primary"/></div>
                    <h3 className="font-bold text-lg text-text-primary">Seafarer's Choice</h3>
                    <p className="text-sm text-text-secondary">Chennai, India</p>
                </Card>
                 <Card className="flex flex-col items-center justify-center text-center !p-10 hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="p-5 bg-blue-50 rounded-full mb-6"><PoseidonIcon className="w-8 h-8 text-primary"/></div>
                    <h3 className="font-bold text-lg text-text-primary">Poseidon Training</h3>
                    <p className="text-sm text-text-secondary">Kolkata, India</p>
                </Card>
                 <Card className="flex flex-col items-center justify-center text-center !p-10 hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="p-5 bg-blue-50 rounded-full mb-6"><RudderIcon className="w-8 h-8 text-primary"/></div>
                    <h3 className="font-bold text-lg text-text-primary">Nautical Skills Inc.</h3>
                    <p className="text-sm text-text-secondary">Goa, India</p>
                </Card>
            </div>
        </div>
    </section>
  </div>
);

const CourseListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', type: '' });
  const [priceRange, setPriceRange] = useState(10000);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredCourses = useMemo(() => {
    return courses
      .filter(c => c.status === Status.APPROVED || c.status === Status.ACTIVE)
      .filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instituteName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(course => filters.location ? course.location.includes(filters.location) : true)
      .filter(course => filters.type ? course.type === filters.type : true)
      .filter(course => course.fee <= priceRange);
  }, [searchTerm, filters, priceRange]);

  return (
    <div className="bg-secondary min-h-screen">
        <div className="bg-white border-b border-border-color py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="text-sm text-text-secondary mb-1">Home / All Courses</div>
                        <h1 className="text-3xl font-extrabold text-text-primary">Browse Maritime Courses</h1>
                        <p className="text-text-secondary mt-1">Find and enroll in DG Shipping-approved courses</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="primary">Log In</Button>
                        <Button variant="secondary">Sign Up</Button>
                    </div>
                </div>
            </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-border-color p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-text-primary">Filters</h3>
                            <button className="text-sm text-primary hover:underline font-medium" onClick={() => {setFilters({location:'', type:''}); setPriceRange(20000)}}>Clear All</button>
                        </div>
                        
                        <div className="space-y-8">
                            {/* Mode */}
                            <div>
                                <h4 className="font-semibold text-text-primary mb-3">Mode</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${filters.type === '' ? 'border-primary' : 'border-gray-300'}`}>
                                            {filters.type === '' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <input type="radio" name="type" value="" checked={filters.type === ''} onChange={handleFilterChange} className="hidden"/> 
                                        <span className="text-text-secondary group-hover:text-text-primary">All Modes</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${filters.type === 'Online' ? 'border-primary' : 'border-gray-300'}`}>
                                            {filters.type === 'Online' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <input type="radio" name="type" value="Online" checked={filters.type === 'Online'} onChange={handleFilterChange} className="hidden"/> 
                                        <span className="text-text-secondary group-hover:text-text-primary">Online</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${filters.type === 'Offline' ? 'border-primary' : 'border-gray-300'}`}>
                                            {filters.type === 'Offline' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                        </div>
                                        <input type="radio" name="type" value="Offline" checked={filters.type === 'Offline'} onChange={handleFilterChange} className="hidden"/> 
                                        <span className="text-text-secondary group-hover:text-text-primary">Offline</span>
                                    </label>
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-semibold text-text-primary mb-3">Price Range</h4>
                                <Slider min={0} max={20000} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} />
                                <div className="flex justify-between text-sm text-text-secondary mt-2">
                                    <span>₹0</span>
                                    <span>₹{priceRange.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Categories Checkboxes (Mock) */}
                            <div>
                                <h4 className="font-semibold text-text-primary mb-3">Duration (Days)</h4>
                                <div className="flex flex-wrap gap-2">
                                    <Badge className="bg-blue-50 text-primary border border-blue-100 px-3 py-1 cursor-pointer">1-2 Days</Badge>
                                    <Badge className="bg-gray-50 text-text-secondary border border-gray-200 px-3 py-1 cursor-pointer">3-5 Days</Badge>
                                    <Badge className="bg-gray-50 text-text-secondary border border-gray-200 px-3 py-1 cursor-pointer">6-7+ Days</Badge>
                                </div>
                            </div>

                             {/* Institute */}
                             <div>
                                <h4 className="font-semibold text-text-primary mb-3">Institute</h4>
                                <select className="w-full px-3 py-2 border border-border-color rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    <option>All Institutes</option>
                                    <option>BlueWave Maritime</option>
                                    <option>Seafarer's Choice</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Course Grid */}
                <main className="flex-1">
                    <div className="bg-white p-4 rounded-xl border border-border-color mb-6 flex justify-between items-center">
                        <p className="text-text-secondary">Showing {filteredCourses.length} results</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-text-secondary">Sort by:</span>
                            <select className="text-sm font-medium text-text-primary border-none focus:ring-0 cursor-pointer">
                                <option>Relevance</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {filteredCourses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map(course => <CourseCard key={course.id} course={course} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-xl border border-border-color">
                            <p className="text-text-secondary text-lg">No courses match your criteria.</p>
                            <Button variant="ghost" className="mt-2" onClick={() => {setFilters({location:'', type:''}); setPriceRange(20000)}}>Clear Filters</Button>
                        </div>
                    )}
                    
                    {/* Pagination Mock */}
                    <div className="flex justify-center gap-2 mt-10">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-color bg-white hover:bg-gray-50"><ChevronLeftIcon/></button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-color bg-white hover:bg-gray-50">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-color bg-white hover:bg-gray-50">3</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-color bg-white hover:bg-gray-50"><ChevronRightIcon/></button>
                    </div>
                </main>
            </div>
        </div>
    </div>
  );
};

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const course = courses.find(c => c.id === id);

    if (!course) {
        return <NotFoundPage />;
    }

    const handleRegisterInterest = () => {
        navigate(`/enroll-success/${course.id}`);
    }

    return (
        <div className="bg-secondary min-h-screen">
             {/* Breadcrumbs */}
             <div className="bg-white border-b border-border-color py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-sm text-text-secondary">
                    <Link to="/" className="hover:text-primary">Home</Link> / <Link to="/courses" className="hover:text-primary">STCW Courses</Link> / <span className="text-text-primary">{course.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Content */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border-color">
                             <div className="relative h-64 sm:h-80">
                                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    {course.isDGApproved && <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 flex items-center gap-1"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 16h-2v2h2v-2zm0-6h-2v4h2v-4z"/></svg> DG Shipping Approved</Badge>}
                                    <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs"><AnchorIcon className="w-3 h-3"/></div>
                                        {course.instituteName}
                                    </div>
                                </div>
                                <h1 className="text-4xl font-bold text-text-primary mb-6">{course.title} (BST)</h1>
                                
                                {/* Tabs Mock */}
                                <div className="flex border-b border-border-color mb-6">
                                    <button className="px-6 py-3 border-b-2 border-primary text-primary font-semibold">Description</button>
                                    <button className="px-6 py-3 text-text-secondary hover:text-text-primary">Schedule</button>
                                    <button className="px-6 py-3 text-text-secondary hover:text-text-primary">Syllabus</button>
                                    <button className="px-6 py-3 text-text-secondary hover:text-text-primary">Instructor</button>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-text-primary mb-3">About this course</h3>
                                    <p className="text-text-secondary leading-relaxed mb-6">
                                        The Basic Safety Training (BST) course is mandatory for all seafarers and is designed to meet the STCW requirements. This course provides essential knowledge and skills to handle emergencies and ensure safety at sea. It covers personal survival techniques, fire prevention and firefighting, elementary first aid, and personal safety and social responsibilities.
                                    </p>
                                    <h3 className="text-xl font-bold text-text-primary mb-3">What you will learn</h3>
                                    <ul className="space-y-2 text-text-secondary mb-6 list-disc list-inside">
                                        <li>Mastering personal survival techniques, including the use of life-saving appliances.</li>
                                        <li>Understanding the principles of fire prevention and acquiring hands-on firefighting skills.</li>
                                        <li>Administering elementary first aid in various emergency situations.</li>
                                        <li>Familiarizing with shipboard safety procedures and social responsibilities.</li>
                                        <li>Developing competence in emergency response and teamwork.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {/* Booking Card */}
                        <Card className="sticky top-24 shadow-lg border-0">
                            <div className="text-3xl font-bold text-text-primary mb-1">₹{course.fee.toLocaleString('en-IN')}</div>
                            <p className="text-sm text-text-secondary mb-6">Total course fee</p>
                            
                            <Button variant="primary-dark" className="w-full !py-3 !text-base mb-4 shadow-md" onClick={handleRegisterInterest}>Login to Enroll</Button>
                            <Button variant="secondary" className="w-full !py-3 !text-base mb-6">♡ Add to Wishlist</Button>
                            
                            <div className="space-y-4 border-t border-border-color pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-primary"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">Duration: {course.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-primary"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">Mode: {course.type} / In-Person</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-primary"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg></div>
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">Language: English</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 text-success"><CheckCircleIcon className="w-5 h-5"/></div>
                                    <div>
                                        <p className="text-sm font-bold text-success">DG Shipping Approved</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EnrollmentConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const course = courses.find(c => c.id === id);

    if (!course) {
        return <NotFoundPage />;
    }
    
    return (
        <div className="bg-secondary min-h-screen flex items-center justify-center py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl">
                <h1 className="text-4xl font-bold text-text-primary mb-4">Thank You! Your Interest is Registered</h1>
                <p className="text-text-secondary text-lg mb-12">We have recorded your interest. You will be notified via email when enrollment opens for this course.</p>
                
                <Card className="max-w-lg mx-auto text-left shadow-lg border-0 !p-0 overflow-hidden">
                    <div className="bg-white p-8">
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-20 h-20 bg-warning-bg rounded-full flex items-center justify-center mb-6">
                                <TrophyIcon />
                            </div>
                            <h2 className="text-2xl font-bold text-text-primary">Confirmation Details</h2>
                            <p className="text-text-secondary mt-2">Please keep the booking reference for your records.</p>
                        </div>
                        
                        <div className="space-y-6 border-t border-border-color pt-8">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary">Course</span>
                                <span className="font-medium text-text-primary">{course.title}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-border-color pt-4">
                                <span className="text-text-secondary">Status</span>
                                <StatusBadge status={Status.INTEREST_REGISTERED} />
                            </div>
                            <div className="flex justify-between items-center border-t border-border-color pt-4">
                                <span className="text-text-secondary">Booking Ref</span>
                                <span className="font-mono font-medium text-text-primary text-lg">INT-2025-0101</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 flex gap-4 justify-center border-t border-border-color">
                        <Link to="/"><Button variant="secondary" className="w-full">Back to Homepage</Button></Link>
                        <Link to="/courses"><Button variant="primary-dark" className="w-full">Explore Other Courses</Button></Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}

const NotFoundPage: React.FC = () => (
    <div className="bg-white flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-[180px] font-black text-primary-dark leading-none">404</h1>
        <h2 className="text-4xl font-bold text-text-primary mb-4">Page Not Found</h2>
        <p className="text-text-secondary max-w-md mx-auto mb-10 text-lg">It seems you've navigated into uncharted waters. The page you're looking for might have been moved, renamed, or doesn't exist.</p>
        <Link to="/">
            <Button variant="accent" className="px-8 py-3 text-lg rounded-lg shadow-md">Return to Homepage</Button>
        </Link>
        
        <div className="mt-12 text-sm text-text-tertiary">
            <Link to="/contact" className="hover:text-primary mx-2">Contact Us</Link> | <Link to="#" className="hover:text-primary mx-2">Help Center</Link>
        </div>
    </div>
);

const InstitutionsPage: React.FC = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-2">Institutions</h1>
        <p className="text-text-secondary mb-8">Information about our partner institutions will be available here soon.</p>
    </div>
);

const AboutUsPage: React.FC = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-text-primary mb-2">About Us</h1>
        <p className="text-text-secondary mb-8">Learn more about Maritime Training Hub and our mission.</p>
    </div>
);

const ContactPage: React.FC = () => (
    <div className="bg-secondary min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-12">
                <h1 className="text-4xl font-extrabold text-primary-dark">We're Here to Help</h1>
                <p className="text-lg text-text-secondary mt-2">Have a question? Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <Card className="shadow-sm border-0">
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <Input label="Full Name" id="name" placeholder="Enter your full name" />
                                <Input label="Email Address" id="email" placeholder="you@example.com" />
                            </div>
                            <Input label="Subject" id="subject" placeholder="How can we help?" />
                            <Textarea label="Message" id="message" placeholder="Enter your message here..." className="h-40" />
                            <Button variant="accent" className="w-full sm:w-auto px-10 py-3 text-base shadow-md">Send Message</Button>
                        </form>
                    </Card>
                </div>

                {/* Contact Info */}
                <div className="lg:col-span-1">
                    <Card className="shadow-sm border-0">
                        <h3 className="text-xl font-bold text-primary-dark mb-6">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-primary-dark"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                                <div>
                                    <p className="font-semibold text-text-primary">Email</p>
                                    <p className="text-text-secondary">support@maritimehub.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-primary-dark"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                                <div>
                                    <p className="font-semibold text-text-primary">Phone</p>
                                    <p className="text-text-secondary">+1 (234) 567-890</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 text-primary-dark"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                                <div>
                                    <p className="font-semibold text-text-primary">Office Hours</p>
                                    <p className="text-text-secondary">Monday - Friday: 9am - 5pm</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                    
                    <div className="mt-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                        <h4 className="font-bold text-primary-dark mb-2">Looking for a course?</h4>
                        <p className="text-sm text-text-secondary mb-4">Browse our DG Shipping-approved catalog to find the right training for your career.</p>
                        <Link to="/courses">
                            <Button variant="primary-dark" className="w-full">Browse Courses</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
)


const PublicPages: React.FC = () => (
    <Routes>
        <Route index element={<HomePage />} />
        <Route path="/courses" element={<CourseListPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/enroll-success/:id" element={<EnrollmentConfirmationPage />} />
        <Route path="/institutions" element={<InstitutionsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
);

export default PublicPages;