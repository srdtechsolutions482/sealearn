import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Role, Status, Vendor, Course, User } from '../types';
import { vendors, courses, enrollments, allUsers } from '../data';
import { Card, Button, StatusBadge, Input, Modal, PlusIcon, EditIcon, ViewIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon, CheckCircleIcon, FileIcon, CoursesIcon, XIcon, VendorsIcon, UsersIcon, Textarea, UploadCloudIcon, CalendarIcon, TrashIcon, SchoolIcon, HourglassIcon, BookOpenIcon, FilterIcon } from '../components/ui';
import DataTable, { Column } from '../components/DataTable';
import CourseCard from '../components/CourseCard';

// --- SHARED COMPONENTS ---
const DashboardHeader: React.FC<{title: string; subtitle?: string, children?: React.ReactNode}> = ({title, subtitle, children}) => (
    <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
            {subtitle && <p className="mt-2 text-text-secondary">{subtitle}</p>}
        </div>
        {children && <div className="flex-shrink-0 mb-1">{children}</div>}
    </div>
);

const StatCard: React.FC<{title:string, value: React.ReactNode, icon?: React.ReactNode, className?: string}> = ({title, value, icon, className}) => (
    <Card className={`flex flex-col justify-between h-full shadow-sm border border-border-color ${className}`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
                <div className="text-4xl font-bold text-text-primary">{value}</div>
            </div>
            {icon && <div className="p-2.5 bg-blue-50 text-primary rounded-lg">{icon}</div>}
        </div>
    </Card>
);

// --- USER DASHBOARD ---
const UserDashboardView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const userEnrollments = enrollments.filter(e => e.userId === user.id);
    const enrolledCourses = courses.filter(c => userEnrollments.some(e => e.courseId === c.id));
    
    return (
        <div>
            <DashboardHeader title={`Welcome back, ${user.name}!`} subtitle="Here's an overview of your training progress."/>
            
            <div className="grid md:grid-cols-4 gap-6 mb-10">
                <Card className="p-6 shadow-sm border border-border-color">
                    <p className="text-sm font-medium text-text-secondary mb-2">Enrolled Courses</p>
                    <div className="text-5xl font-bold text-primary">5</div>
                </Card>
                <Card className="p-6 shadow-sm border border-border-color">
                    <p className="text-sm font-medium text-text-secondary mb-2">Courses Completed</p>
                    <div className="text-5xl font-bold text-teal-500">2</div>
                </Card>
                <Card className="p-6 shadow-sm border border-border-color">
                    <p className="text-sm font-medium text-text-secondary mb-2">Certificates Earned</p>
                    <div className="text-5xl font-bold text-orange-400">2</div>
                </Card>
                <Card className="p-6 shadow-sm border border-border-color">
                    <p className="text-sm font-medium text-text-secondary mb-2">Recommended Courses</p>
                    <div className="text-5xl font-bold text-text-tertiary">12</div>
                </Card>
            </div>

             <h2 className="text-2xl font-bold text-text-primary mb-6">Recommended For You</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.slice(0, 4).map(c => (
                    <div key={c.id} className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden flex flex-col">
                        <img src={c.imageUrl} alt={c.title} className="h-40 w-full object-cover"/>
                        <div className="p-5 flex-1 flex flex-col">
                            <p className="text-xs font-bold text-primary uppercase mb-2">DG Shipping Approved</p>
                            <h3 className="font-bold text-text-primary text-lg leading-tight mb-2">{c.title}</h3>
                            <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">{c.description}</p>
                            <Button variant="primary-dark" className="w-full mt-auto">View Course</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const UserProfileView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;
    
    return (
         <div>
            <div className="mb-4 text-sm text-text-secondary">Home / Profile</div>
            <h1 className="text-3xl font-bold text-text-primary mb-8">My Profile</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-border-color p-8 text-center shadow-sm">
                         <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full p-1 border-4 border-orange-100 mx-auto">
                                <img src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full rounded-full object-cover" />
                            </div>
                            <button className="absolute bottom-0 right-0 bg-primary-dark text-white p-2 rounded-full hover:bg-primary transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            </button>
                         </div>
                         <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
                         <p className="text-text-secondary">{user.rank}</p>
                         
                         <Button variant="primary-dark" className="mt-6 w-full py-3">Edit Profile</Button>
                    </div>
                </div>

                {/* Right Column - Info */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-0 shadow-sm !p-8">
                        <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div><p className="text-sm text-text-secondary mb-1">Full Name</p><p className="font-medium text-text-primary text-lg">{user.name}</p></div>
                            <div><p className="text-sm text-text-secondary mb-1">Rank</p><p className="font-medium text-text-primary text-lg">{user.rank}</p></div>
                            <div><p className="text-sm text-text-secondary mb-1">Email Address</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-text-primary text-lg">{user.email}</p>
                                    {/* <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircleIcon className="w-3 h-3"/> Verified</span> */}
                                    <StatusBadge status={Status.VERIFIED}/>
                                </div>
                            </div>
                             <div><p className="text-sm text-text-secondary mb-1">Mobile Number</p><p className="font-medium text-text-primary text-lg">{user.phone || 'N/A'}</p></div>
                        </div>
                    </Card>
                    
                     <Card className="border-0 shadow-sm !p-8">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-lg font-bold text-text-primary">My Certificates</h3>
                             <Button variant="primary"><PlusIcon className="w-4 h-4"/> Upload New</Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border-color">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 text-primary rounded-lg"><FileIcon/></div>
                                    <div>
                                        <p className="font-bold text-text-primary">Basic Safety Training (STCW)</p>
                                        <p className="text-xs text-text-secondary">Issued by: Maritime Academy | Expires: 24 Dec 2025</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-text-secondary">
                                    <button className="p-2 hover:text-primary"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                                    <button className="p-2 hover:text-primary"><EditIcon/></button>
                                    <button className="p-2 hover:text-danger"><TrashIcon/></button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border-color">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 text-primary rounded-lg"><FileIcon/></div>
                                    <div>
                                        <p className="font-bold text-text-primary">Security Training for Seafarers</p>
                                        <p className="text-xs text-text-secondary">Issued by: DG Shipping | Expires: 15 Jun 2026</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-text-secondary">
                                    <button className="p-2 hover:text-primary"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                                    <button className="p-2 hover:text-primary"><EditIcon/></button>
                                    <button className="p-2 hover:text-danger"><TrashIcon/></button>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
         </div>
    )
}

// --- VENDOR DASHBOARD ---
const VendorDashboardView: React.FC = () => {
    const { user } = useAuth();
    if (!user || user.role !== Role.VENDOR) return null;

    const vendor = user as Vendor;
    const vendorCourses = courses.filter(c => c.instituteId === vendor.id);
    const approvedCount = vendorCourses.filter(c => c.status === Status.APPROVED).length;
    const rejectedCount = vendorCourses.filter(c => c.status === Status.REJECTED).length;
    
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            {vendor.status === Status.PENDING && (
                <div className="bg-warning-bg border border-warning text-yellow-800 p-4 rounded-xl mb-8 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-200 p-2 rounded-full text-yellow-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div>
                            <p className="font-bold text-lg">Your institute is pending verification</p>
                            <p className="text-sm opacity-90">Please ensure all your documents are uploaded correctly. Our team will review your application shortly.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 font-semibold cursor-pointer hover:underline">
                        Review Documents <ChevronRightIcon className="w-4 h-4"/>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-4 gap-6 mb-10">
                 <StatCard title="Status" value={
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${vendor.status === Status.PENDING ? 'bg-warning' : 'bg-success'}`}></span>
                        {vendor.status}
                    </div>
                 } className="p-6"/>
                 <StatCard title="Total Courses" value={vendorCourses.length} className="p-6"/>
                 <StatCard title="Approved Courses" value={approvedCount} className="p-6"/>
                 <StatCard title="Rejected Courses" value={rejectedCount} className="p-6"/>
            </div>

             <h2 className="text-2xl font-bold text-text-primary mb-4">My Courses</h2>
             <Card className="!p-0 overflow-hidden border-0 shadow-sm">
                <DataTable 
                    columns={[
                        { header: 'COURSE NAME', accessor: 'title'},
                        { header: 'STATUS', accessor: (c) => <StatusBadge status={c.status} />},
                        { header: 'ENROLLMENTS', accessor: (c) => Math.floor(Math.random() * 200)},
                        { header: '', accessor: () => <button className="text-primary font-medium hover:underline">Manage</button>}
                    ]}
                    data={vendorCourses}
                />
             </Card>
        </div>
    );
};

const VendorCourseManagementView: React.FC = () => {
    const { user } = useAuth();
    if (!user || user.role !== Role.VENDOR) return null; // Guard

    const vendorCourses = courses.filter(c => c.instituteId === user.id);
    const columns: Column<Course>[] = [
        { header: 'COURSE ID', accessor: 'courseCode' },
        { header: 'COURSE TITLE', accessor: 'title' },
        { header: 'STATUS', accessor: (item) => <StatusBadge status={item.status} /> },
        { header: 'FEES', accessor: (item) => `₹${item.fee.toLocaleString('en-IN')}`},
        { header: 'ACTIONS', accessor: () => (
            <div className="flex items-center space-x-3 text-text-secondary">
              <button className="hover:text-primary"><EditIcon /></button>
              <button className="hover:text-primary"><ViewIcon /></button>
            </div>
        )}
    ];
     return (
        <div>
            <DashboardHeader title="Manage Your Courses" subtitle="View, edit, and manage all your course listings.">
                <Link to="new">
                    <Button variant="primary"><PlusIcon/> Add New Course</Button>
                </Link>
            </DashboardHeader>
            <Card className="!p-0 border-0 shadow-sm">
                 <div className="p-4 border-b border-border-color flex items-center justify-between gap-4">
                     <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </div>
                        <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" placeholder="Search by Course Title or ID" />
                     </div>
                      <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
                        <button className="px-4 py-1.5 rounded-md bg-primary-light text-primary font-medium text-sm shadow-sm">All</button>
                        <button className="px-4 py-1.5 rounded-md text-text-secondary font-medium text-sm hover:bg-white">Approved</button>
                        <button className="px-4 py-1.5 rounded-md text-text-secondary font-medium text-sm hover:bg-white">Pending</button>
                        <button className="px-4 py-1.5 rounded-md text-text-secondary font-medium text-sm hover:bg-white">Rejected</button>
                      </div>
                 </div>
                <DataTable columns={columns} data={vendorCourses} />
            </Card>
        </div>
     )
};

const VendorAddCourseView: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-text-primary mb-8">Add a New Course</h1>
            
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {/* Core Details */}
                    <div className="bg-white p-8 rounded-xl border border-border-color shadow-sm">
                        <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-2">Core Details</h3>
                        <div className="space-y-6">
                            <Input label="Course Title" placeholder="e.g. Advanced Fire Fighting" />
                            <Textarea label="Course Description" placeholder="Provide a detailed description of the course, including topics covered, learning objectives, and prerequisites." className="h-32" />
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="bg-white p-8 rounded-xl border border-border-color shadow-sm">
                        <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-2">Course Thumbnail</h3>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <UploadCloudIcon className="w-12 h-12 text-text-tertiary mb-4" />
                            <p className="text-text-primary font-medium">Drag & drop files here</p>
                            <p className="text-sm text-text-secondary mt-1">or click to browse. PNG, JPG up to 5MB.</p>
                        </div>
                    </div>

                    {/* Logistics */}
                    <div className="bg-white p-8 rounded-xl border border-border-color shadow-sm">
                        <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-2">Logistical Information</h3>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Mode</label>
                                <div className="flex bg-secondary p-1 rounded-lg">
                                    <button className="flex-1 py-2 bg-white shadow-sm rounded-md text-sm font-medium text-primary">Online</button>
                                    <button className="flex-1 py-2 text-sm font-medium text-text-secondary">Offline</button>
                                </div>
                            </div>
                            <div className="relative">
                                <Input label="Duration" placeholder="5" />
                                <span className="absolute right-4 top-[34px] text-text-secondary text-sm">Days</span>
                            </div>
                        </div>
                        <div className="relative">
                             <Input label="Course Fees" placeholder=" 7500" />
                             <span className="absolute left-4 top-[34px] text-text-primary">₹</span>
                        </div>
                    </div>

                    {/* Scheduling */}
                    <div className="bg-white p-8 rounded-xl border border-border-color shadow-sm">
                        <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-2">Scheduling & Staff</h3>
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="relative">
                                <Input label="Start Date" placeholder="11/22/2025" />
                                <CalendarIcon className="absolute right-4 top-[34px] w-5 h-5 text-text-secondary" />
                            </div>
                            <div className="relative">
                                <Input label="End Date" placeholder="mm/dd/yyyy" />
                                <CalendarIcon className="absolute right-4 top-[34px] w-5 h-5 text-text-secondary" />
                            </div>
                        </div>
                        <Input label="Instructor Name" placeholder="e.g., Capt. John Doe" />
                    </div>
                    
                    <div className="flex justify-end gap-4">
                        <Button variant="secondary" className="px-8 py-3">Save as Draft</Button>
                        <Button variant="primary-dark" className="px-8 py-3">Create Course</Button>
                    </div>
                </div>

                {/* Live Preview Sidebar */}
                <div className="col-span-1">
                    <h3 className="font-bold text-text-primary mb-4">Live Preview</h3>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border-color">
                        <img src="https://images.unsplash.com/photo-1559024926-751d3b13e873?q=80&w=2070&auto=format&fit=crop" alt="Preview" className="w-full h-48 object-cover" />
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-text-primary leading-tight">Advanced Fire Fighting</h4>
                                <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded font-medium">Online</span>
                            </div>
                            <p className="text-sm text-text-secondary mb-4">Maritime Institute</p>
                            <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                                <div className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> 5 Days</div>
                                <div className="flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> Starts 22 Nov 2025</div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-border-color">
                                <span className="text-xl font-bold text-primary-dark">₹7500</span>
                                <span className="text-sm font-medium text-primary cursor-pointer">View Details</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const VendorProfileView: React.FC = () => {
    const { user } = useAuth();
    if (!user || user.role !== Role.VENDOR) return null; // Guard
    const vendor = user as Vendor;

    return (
        <div>
            <DashboardHeader title="Institute Profile">
                <Button variant="primary-dark"><EditIcon/> Edit Profile</Button>
            </DashboardHeader>
            <Card className="shadow-sm border-0">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Institute Details</h3>
                    <p className="text-text-secondary mb-6">Key information about your institute.</p>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 border-b border-gray-100 pb-4">
                            <div className="text-text-secondary">Institute Name</div>
                            <div className="col-span-2 font-medium text-text-primary">{vendor.instituteName}</div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-gray-100 pb-4">
                            <div className="text-text-secondary">Accreditation No.</div>
                            <div className="col-span-2 font-medium text-text-primary">{vendor.accreditationNo}</div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-gray-100 pb-4">
                            <div className="text-text-secondary">Email</div>
                            <div className="col-span-2 font-medium text-text-primary">{vendor.email}</div>
                        </div>
                        <div className="grid grid-cols-3 pb-4">
                            <div className="text-text-secondary">Status</div>
                            <div className="col-span-2">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                    <CheckCircleIcon className="w-4 h-4"/> Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-8">
                    <h3 className="text-xl font-bold text-text-primary mb-2">Official Documents</h3>
                    <p className="text-text-secondary mb-6">Manage accreditation and other official documents.</p>
                    
                    <div className="bg-white border border-border-color rounded-xl p-4 flex justify-between items-center max-w-2xl">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg text-text-secondary">
                                <FileIcon className="w-6 h-6"/>
                            </div>
                            <div>
                                <p className="font-medium text-text-primary">accreditation.pdf</p>
                                <p className="text-xs text-text-secondary">Uploaded 12 Jan 2024</p>
                            </div>
                        </div>
                        <button className="text-primary-dark font-medium text-sm hover:underline">View</button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

// --- ADMIN DASHBOARD ---
const AdminDashboardView: React.FC = () => {
    const pendingVendors = vendors.filter(v => v.status === Status.PENDING);
    return (
        <div>
            <DashboardHeader title="Super Admin Dashboard">
                <span className="text-sm text-text-secondary flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Last updated: just now</span>
            </DashboardHeader>
            
            <div className="grid md:grid-cols-4 gap-6 mb-10">
                 <StatCard title="Total Institutes" value={vendors.length} icon={<SchoolIcon className="w-6 h-6"/>} className="p-6 bg-white"/>
                 <StatCard title="Pending Approvals" value={pendingVendors.length} icon={<HourglassIcon className="w-6 h-6 text-yellow-600"/>} className="p-6 bg-white"/>
                 <StatCard title="Total Courses" value={courses.length} icon={<BookOpenIcon className="w-6 h-6"/>} className="p-6 bg-white"/>
                 <StatCard title="Active Users" value={allUsers.filter(u => u.role === Role.USER).length} icon={<UsersIcon className="w-6 h-6"/>} className="p-6 bg-white"/>
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2">
                    <h2 className="text-2xl font-bold text-text-primary mb-6">Institutes Awaiting Approval</h2>
                    <Card className="!p-0 border-0 shadow-sm overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-secondary text-text-secondary font-semibold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Institute Name</th>
                                    <th className="px-6 py-4">Date Submitted</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-color">
                                {pendingVendors.length > 0 ? pendingVendors.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-text-primary">{v.instituteName}</td>
                                        <td className="px-6 py-4 text-text-secondary">{v.submissionDate || '2023-10-26'}</td>
                                        <td className="px-6 py-4"><span className="bg-warning-bg text-warning px-2 py-1 rounded text-xs font-bold">Pending</span></td>
                                        <td className="px-6 py-4"><Button variant="primary" size="sm">Review</Button></td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">No pending approvals</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </div>
                <div className="col-span-1">
                    <h2 className="text-2xl font-bold text-text-primary mb-6">Platform Growth Overview</h2>
                    <Card className="h-[400px] flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-text-secondary text-sm">New Users</p>
                                <p className="text-3xl font-bold text-text-primary">125</p>
                                <p className="text-success text-xs font-semibold mt-1">+15% last 30 days</p>
                            </div>
                            <p className="text-xs text-text-secondary">Last 30 Days</p>
                        </div>
                        {/* Mock Bar Chart matching the screenshot style */}
                        <div className="flex items-end justify-between h-48 px-2 gap-3 mt-auto">
                            <div className="w-full bg-blue-200 rounded-t-md h-[40%] opacity-50"></div>
                            <div className="w-full bg-blue-200 rounded-t-md h-[60%] opacity-50"></div>
                            <div className="w-full bg-primary rounded-t-md h-[85%]"></div>
                            <div className="w-full bg-blue-200 rounded-t-md h-[55%] opacity-50"></div>
                            <div className="w-full bg-blue-200 rounded-t-md h-[70%] opacity-50"></div>
                            <div className="w-full bg-blue-200 rounded-t-md h-[45%] opacity-50"></div>
                            <div className="w-full bg-blue-200 rounded-t-md h-[90%] opacity-50"></div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const AdminCourseManagementView: React.FC = () => {
    const columns: Column<Course>[] = [
        { header: '', accessor: () => <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />},
        { header: 'Course ID', accessor: (c) => `#${c.courseCode}` },
        { header: 'Course Title', accessor: 'title' },
        { header: 'Vendor', accessor: 'instituteName' },
        { header: 'Status', accessor: (item) => <StatusBadge status={item.status} /> },
        { header: 'Actions', accessor: () => (
            <div className="flex items-center space-x-3 text-text-secondary">
              <button className="hover:text-primary"><EditIcon /></button>
              <button className="hover:text-primary"><ViewIcon /></button>
              <button className="hover:text-danger"><DeleteIcon /></button>
            </div>
        )}
    ];

    return (
      <div>
        <DashboardHeader title="Course Management">
             <Button variant="primary"><PlusIcon /> Add New Course</Button>
        </DashboardHeader>
        <Card className="!p-0 border-0 shadow-sm">
             <div className="p-4 border-b border-border-color flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full max-w-xl">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <input type="text" className="block w-full pl-10 pr-3 py-2 border border-border-color rounded-md leading-5 bg-white placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm" placeholder="Search by Course Title, ID, or Vendor..." />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <select className="px-3 py-2 border border-border-color rounded-md text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"><option>Status: All</option></select>
                    <select className="px-3 py-2 border border-border-color rounded-md text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"><option>Vendor: All</option></select>
                    <button className="text-sm text-text-secondary hover:text-primary font-medium whitespace-nowrap">Reset Filters</button>
                </div>
            </div>
            <DataTable columns={columns} data={courses} />
            <div className="p-4 border-t border-border-color flex justify-between items-center text-sm text-text-secondary">
                <span>Showing 1 to 10 of {courses.length} results</span>
                <div className="inline-flex items-center space-x-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 bg-white"><ChevronLeftIcon className="w-4 h-4"/></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 bg-white"><ChevronRightIcon className="w-4 h-4"/></button>
                </div>
            </div>
        </Card>
      </div>
    );
};

const AdminVendorManagementView: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    const openModal = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setIsModalOpen(true);
    };

    // Filter to just pending for this specific "Approval Queue" style view
    const pendingVendors = vendors.filter(v => v.status === Status.PENDING);

    const columns: Column<Vendor>[] = [
        { header: '', accessor: () => <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />},
        { header: 'INSTITUTE ID', accessor: (v) => `V-0012${v.id.replace('v','')}` },
        { header: 'INSTITUTE NAME', accessor: 'instituteName' },
        { header: 'DATE SUBMITTED', accessor: (v) => v.submissionDate || '2023-10-26' },
        { header: 'STATUS', accessor: (item) => <StatusBadge status={item.status} />},
        { header: 'ACTIONS', accessor: (item) => (
            <button onClick={() => openModal(item)} className="text-primary hover:underline font-medium">Review</button>
        )}
    ];

    return (
        <div>
            <DashboardHeader title="Vendor Approval Queue">
                <Button variant="primary"><PlusIcon/> Add Vendor</Button>
            </DashboardHeader>
            
            <Card className="!p-0 border-0 shadow-sm">
                 <div className="p-4 border-b border-border-color flex items-center justify-between gap-4">
                     <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </div>
                        <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm" placeholder="Search by institute name or ID..." />
                     </div>
                      <div className="flex items-center gap-3">
                        <Button variant="secondary" className="flex items-center gap-2 border-border-color"><FilterIcon/> Filter</Button>
                        <Button variant="secondary" className="flex items-center gap-2 border-border-color">Bulk Actions <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg></Button>
                      </div>
                 </div>
                <DataTable columns={columns} data={pendingVendors} />
                <div className="p-4 border-t border-border-color flex justify-between items-center text-sm text-text-secondary">
                    <span>Showing 1 to {pendingVendors.length} of {pendingVendors.length} results</span>
                    <div className="inline-flex items-center space-x-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 bg-white" disabled><ChevronLeftIcon className="w-4 h-4"/></button>
                        <button className="w-8 h-8 flex items-center justify-center rounded bg-primary-light text-primary font-bold">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 bg-white"><ChevronRightIcon className="w-4 h-4"/></button>
                    </div>
                </div>
            </Card>

            {/* Review Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Vendor Application Review">
                {selectedVendor && (
                     <div>
                         <div className="mb-6">
                             <h3 className="text-xl font-bold mb-4">Vendor Information</h3>
                             <div className="bg-white border border-border-color rounded-lg p-6 space-y-4">
                                <div className="grid grid-cols-3 border-b border-gray-100 pb-4">
                                    <div className="text-text-secondary">Institute Name</div>
                                    <div className="col-span-2 font-medium text-text-primary">{selectedVendor.instituteName}</div>
                                </div>
                                <div className="grid grid-cols-3 border-b border-gray-100 pb-4">
                                    <div className="text-text-secondary">Accreditation No</div>
                                    <div className="col-span-2 font-medium text-text-primary">{selectedVendor.accreditationNo}</div>
                                </div>
                                <div className="grid grid-cols-3 border-b border-gray-100 pb-4">
                                    <div className="text-text-secondary">Submission Date</div>
                                    <div className="col-span-2 font-medium text-text-primary">{selectedVendor.submissionDate || 'October 26, 2023'}</div>
                                </div>
                                <div className="grid grid-cols-3">
                                    <div className="text-text-secondary">Status</div>
                                    <div className="col-span-2"><StatusBadge status={selectedVendor.status}/></div>
                                </div>
                             </div>
                         </div>

                         <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <h3 className="text-xl font-bold mb-4">Submitted Documents</h3>
                                <div className="bg-white border border-border-color rounded-lg divide-y divide-border-color">
                                    {selectedVendor.documents.length > 0 ? selectedVendor.documents.map(doc => (
                                        <div key={doc.name} className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-red-50 text-red-500 rounded"><FileIcon/></div>
                                                <div>
                                                    <p className="font-medium text-text-primary">{doc.name}</p>
                                                    <p className="text-xs text-text-secondary">{doc.size}</p>
                                                </div>
                                            </div>
                                            <button className="text-text-secondary hover:text-primary"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></button>
                                        </div>
                                    )) : <p className="p-4 text-text-secondary text-sm">No documents available</p>}
                                </div>
                            </div>
                            <div className="col-span-1">
                                <div className="bg-white border border-border-color rounded-lg p-6 shadow-sm h-full">
                                    <h3 className="text-lg font-bold mb-2">Actions</h3>
                                    <p className="text-sm text-text-secondary mb-6">Review the submitted documents and vendor details before making a decision.</p>
                                    <div className="space-y-3">
                                        <Button variant="success" className="w-full">Approve Vendor</Button>
                                        <Button variant="danger" className="w-full">Reject Application</Button>
                                    </div>
                                </div>
                            </div>
                         </div>
                     </div>
                )}
            </Modal>
        </div>
    );
};

const AdminProfileView: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    return (
        <div>
            <div className="mb-4 text-sm text-text-secondary">Home / Profile</div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Personal Information</h1>
            <p className="text-text-secondary mb-8">Update your photo and personal details here.</p>

            <div className="bg-white rounded-xl border border-border-color p-6 mb-8 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                        <img src={user.profilePictureUrl || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
                        <p className="text-text-secondary">{user.email}</p>
                        <p className="text-xs text-text-tertiary mt-1">Last login: 2023-10-27 10:30 AM from 192.168.1.1</p>
                    </div>
                </div>
                <Button variant="secondary">Upload new picture</Button>
            </div>

            <Card className="border-0 shadow-sm !p-8 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Input label="Full Name" defaultValue={user.name} />
                    <div className="w-full">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                        <input type="text" defaultValue={user.email} className="w-full px-4 py-2.5 border border-border-color rounded-lg shadow-sm text-text-secondary bg-gray-50 focus:outline-none" readOnly />
                    </div>
                    <Input label="Phone Number" defaultValue={user.phone || '+1 234 567 890'} />
                    <div className="w-full">
                        <label className="block text-sm font-medium text-text-secondary mb-1">Role</label>
                        <input type="text" defaultValue="Super Administrator" className="w-full px-4 py-2.5 border border-border-color rounded-lg shadow-sm text-text-secondary bg-gray-50 focus:outline-none" readOnly />
                    </div>
                </div>
                <div className="flex justify-end gap-4 border-t border-border-color pt-6">
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="primary-dark">Save Changes</Button>
                </div>
            </Card>

            <div className="border border-red-200 bg-red-50 rounded-xl p-6 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-text-primary">Deactivate Account</h4>
                    <p className="text-sm text-text-secondary mt-1">Permanently deactivate your account. This action cannot be undone.</p>
                </div>
                <Button variant="danger">Deactivate</Button>
            </div>
        </div>
    )
}

const AdminUserManagementView: React.FC = () => {
     const userList = allUsers.filter(u => u.role === 'user');
     const columns: Column<User>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Rank', accessor: 'rank'},
        { header: 'Actions', accessor: () => (
            <div className="flex items-center space-x-3 text-text-secondary">
              <button className="hover:text-primary"><ViewIcon /></button>
              <button className="hover:text-danger"><DeleteIcon /></button>
            </div>
        )}
    ];
    return (
        <div>
            <DashboardHeader title="User Management" />
            <Card className="!p-0">
                <DataTable columns={columns} data={userList} />
            </Card>
        </div>
    )
}


const DashboardPages: React.FC = () => {
    const { role } = useAuth();
    
    // Fallback simple view for unimplemented pages
    const GenericView: React.FC<{ title: string }> = ({ title }) => (
        <div>
            <DashboardHeader title={title} />
            <Card>
                <p>Content for this page is under construction.</p>
            </Card>
        </div>
    );

    const renderUserRoutes = () => (
        <Routes>
            <Route index element={<UserDashboardView />} />
            <Route path="courses" element={<UserDashboardView />} />
            <Route path="profile" element={<UserProfileView />} />
        </Routes>
    );

    const renderVendorRoutes = () => (
         <Routes>
            <Route index element={<VendorDashboardView />} />
            <Route path="courses" element={<VendorCourseManagementView />} />
            <Route path="courses/new" element={<VendorAddCourseView />} />
            <Route path="students" element={<GenericView title="Student Enquiries" />} />
            <Route path="profile" element={<VendorProfileView />} />
        </Routes>
    );

    const renderAdminRoutes = () => (
        <Routes>
            <Route index element={<AdminDashboardView />} />
            <Route path="vendors" element={<AdminVendorManagementView />} />
            <Route path="courses" element={<AdminCourseManagementView />} />
            <Route path="users" element={<AdminUserManagementView />} />
            <Route path="profile" element={<AdminProfileView />} />
        </Routes>
    );

    switch (role) {
        case Role.USER:
            return renderUserRoutes();
        case Role.VENDOR:
            return renderVendorRoutes();
        case Role.ADMIN:
            return renderAdminRoutes();
        default:
            return <div>Invalid Role</div>;
    }
};

export default DashboardPages;