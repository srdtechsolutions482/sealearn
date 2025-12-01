import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Role, Status, Vendor, Course, User } from "../types";
import { vendors, courses, enrollments, allUsers, courselist } from "../data";
import {
  Card,
  Button,
  StatusBadge,
  Input,
  Modal,
  PlusIcon,
  EditIcon,
  ViewIcon,
  DeleteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  FileIcon,
  CoursesIcon,
  XIcon,
  VendorsIcon,
  UsersIcon,
  Textarea,
  UploadCloudIcon,
  CalendarIcon,
  TrashIcon,
  SchoolIcon,
  HourglassIcon,
  BookOpenIcon,
  FilterIcon,
} from "../components/ui";
import DataTable, { Column } from "../components/DataTable";
import CourseCard from "../components/CourseCard";

const currencyList = ["INR", "USD", "EUR", "GBP", "AUD", "CAD", "SGD"];

// --- SHARED COMPONENTS ---
const DashboardHeader: React.FC<{
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <div className="flex justify-between items-end mb-8">
    <div>
      <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
      {subtitle && <p className="mt-2 text-text-secondary">{subtitle}</p>}
    </div>
    {children && <div className="flex-shrink-0 mb-1">{children}</div>}
  </div>
);

const SearchableDropdown: React.FC<{
  options: string[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  readOnly?: boolean;
  multiple?: boolean;
  className?: string;
  error?: boolean;
}> = ({
  options,
  value,
  onChange,
  placeholder,
  readOnly,
  multiple = false,
  className,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    if (readOnly) return;
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(option)
        ? currentValues.filter((v) => v !== option)
        : [...currentValues, option];
      onChange(newValue);
    } else {
      onChange(option);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const removeValue = (e: React.MouseEvent, optionToRemove: string) => {
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      onChange(value.filter((v) => v !== optionToRemove));
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        className={`w-full min-h-[38px] px-3 py-2 border rounded-md bg-white flex items-center justify-between cursor-pointer transition-colors ${
          readOnly
            ? "bg-gray-50 cursor-default"
            : "hover:border-primary focus:ring-1 focus:ring-primary"
        } ${error ? "border-red-500" : "border-border-color"}`}
        onClick={() => !readOnly && setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1">
          {multiple && Array.isArray(value) && value.length > 0 ? (
            value.map((val) => (
              <span
                key={val}
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md flex items-center border border-blue-100"
              >
                {val}
                {!readOnly && (
                  <button
                    onClick={(e) => removeValue(e, val)}
                    className="ml-1 hover:text-blue-900 focus:outline-none"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))
          ) : !multiple && value ? (
            <span className="text-text-primary text-sm">{value}</span>
          ) : (
            <span className="text-text-tertiary text-sm">
              {placeholder || "Select..."}
            </span>
          )}
        </div>
        <div className="flex items-center text-text-secondary ml-2">
          {/* Chevron */}
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {isOpen && !readOnly && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border-color rounded-md shadow-xl max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <input
              type="text"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = multiple
                  ? Array.isArray(value) && value.includes(option)
                  : value === option;
                return (
                  <div
                    key={option}
                    className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? "bg-blue-50 text-primary font-medium"
                        : "text-text-primary hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                    {isSelected && (
                      <CheckCircleIcon className="w-4 h-4 text-primary" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-text-tertiary text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, value, icon, className }) => (
  <Card
    className={`flex flex-col justify-between h-full shadow-sm border border-border-color ${className}`}
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
        <div className="text-4xl font-bold text-text-primary">{value}</div>
      </div>
      {icon && (
        <div className="p-2.5 bg-blue-50 text-primary rounded-lg">{icon}</div>
      )}
    </div>
  </Card>
);

// --- USER DASHBOARD ---
const UserDashboardView: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const userEnrollments = enrollments.filter((e) => e.userId === user.id);
  const enrolledCourses = courses.filter((c) =>
    userEnrollments.some((e) => e.courseId === c.id)
  );

  return (
    <div>
      <DashboardHeader
        title={`Welcome back, ${user.name}!`}
        subtitle="Here's an overview of your training progress."
      />

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card className="p-6 shadow-sm border border-border-color">
          <p className="text-sm font-medium text-text-secondary mb-2">
            Enrolled Courses
          </p>
          <div className="text-5xl font-bold text-primary">5</div>
        </Card>
        <Card className="p-6 shadow-sm border border-border-color">
          <p className="text-sm font-medium text-text-secondary mb-2">
            Courses Completed
          </p>
          <div className="text-5xl font-bold text-teal-500">2</div>
        </Card>
        <Card className="p-6 shadow-sm border border-border-color">
          <p className="text-sm font-medium text-text-secondary mb-2">
            Certificates Earned
          </p>
          <div className="text-5xl font-bold text-orange-400">2</div>
        </Card>
        <Card className="p-6 shadow-sm border border-border-color">
          <p className="text-sm font-medium text-text-secondary mb-2">
            Recommended Courses
          </p>
          <div className="text-5xl font-bold text-text-tertiary">12</div>
        </Card>
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-6">
        Recommended For You
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.slice(0, 4).map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-xl shadow-sm border border-border-color overflow-hidden flex flex-col"
          >
            <img
              src={c.imageUrl}
              alt={c.title}
              className="h-40 w-full object-cover"
            />
            <div className="p-5 flex-1 flex flex-col">
              <p className="text-xs font-bold text-primary uppercase mb-2">
                DG Shipping Approved
              </p>
              <h3 className="font-bold text-text-primary text-lg leading-tight mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-1">
                {c.description}
              </p>
              <Button variant="primary-dark" className="w-full mt-auto">
                View Course
              </Button>
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
                <img
                  src={
                    user.profilePictureUrl ||
                    `https://ui-avatars.com/api/?name=${user.name}&background=random`
                  }
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
            <p className="text-text-secondary">{user.rank}</p>
          </div>
        </div>

        {/* Right Column - Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-0 shadow-sm !p-8">
            <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-sm text-text-secondary mb-1">Full Name</p>
                <p className="font-medium text-text-primary text-lg">
                  {user.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Rank</p>
                <p className="font-medium text-text-primary text-lg">
                  {user.rank}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">
                  Email Address
                </p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-text-primary text-lg">
                    {user.email}
                  </p>
                  <StatusBadge status={Status.VERIFIED} />
                </div>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">
                  Mobile Number
                </p>
                <p className="font-medium text-text-primary text-lg">
                  {user.phone || "N/A"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-0 shadow-sm !p-8">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-lg font-bold text-text-primary">
                My Certificates
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border-color">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-primary rounded-lg">
                    <FileIcon />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">
                      Basic Safety Training (STCW)
                    </p>
                    <p className="text-xs text-text-secondary">
                      Issued by: Maritime Academy | Expires: 24 Dec 2025
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 text-text-secondary">
                  <button className="p-2 hover:text-primary">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border-color">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-primary rounded-lg">
                    <FileIcon />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">
                      Security Training for Seafarers
                    </p>
                    <p className="text-xs text-text-secondary">
                      Issued by: DG Shipping | Expires: 15 Jun 2026
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 text-text-secondary">
                  <button className="p-2 hover:text-primary">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- VENDOR DASHBOARD ---
const VendorDashboardView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  if (!user || user.role !== Role.VENDOR) return null;

  const vendor = user as Vendor;
  const vendorCourses = courses.filter((c) => c.instituteId === vendor.id);
  const approvedCount = vendorCourses.filter(
    (c) => c.status === Status.APPROVED
  ).length;
  const rejectedCount = vendorCourses.filter(
    (c) => c.status === Status.REJECTED
  ).length;
  const pendingCount = vendorCourses.filter(
    (c) => c.status === Status.PENDING
  ).length;

  // --- Analytical Data ---
  const pieData = [
    { name: "Approved", value: approvedCount, color: "#10B981" },
    { name: "Rejected", value: rejectedCount, color: "#EF4444" },
    { name: "Pending", value: pendingCount, color: "#F59E0B" },
  ].filter((d) => d.value > 0);

  // Calculate Gradient for Pie Chart
  const total = approvedCount + rejectedCount + pendingCount;
  let currentAngle = 0;
  const gradientSegments = pieData
    .map((d) => {
      const percentage = (d.value / total) * 100;
      const endAngle = currentAngle + percentage;
      const segment = `${d.color} ${currentAngle}% ${endAngle}%`;
      currentAngle = endAngle;
      return segment;
    })
    .join(", ");

  const conicGradient =
    total > 0 ? `conic-gradient(${gradientSegments})` : "none";

  const barData = vendorCourses
    .map((c) => ({
      name: c.title.length > 20 ? c.title.substring(0, 20) + "..." : c.title,
      fullTitle: c.title,
      students: enrollments.filter((e) => e.courseId === c.id).length,
    }))
    .sort((a, b) => b.students - a.students)
    .slice(0, 5);

  const maxStudents = Math.max(...barData.map((d) => d.students), 1);

  // --- Search, Sort, Pagination Logic for "My Courses" ---
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const getStudentCount = (courseId: string) =>
    enrollments.filter((e) => e.courseId === courseId).length;

  const processedCourses = useMemo(() => {
    let data = [...vendorCourses];

    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerTerm) ||
          c.courseCode.toLowerCase().includes(lowerTerm)
      );
    }

    // Sort
    if (sortConfig) {
      data.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof Course];
        let bVal: any = b[sortConfig.key as keyof Course];

        if (sortConfig.key === "students") {
          aVal = getStudentCount(a.id);
          bVal = getStudentCount(b.id);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [vendorCourses, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedCourses.length / pageSize);
  const currentCourses = processedCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  return (
    <div>
      <DashboardHeader
        title={`Admin Dashboard`}
        subtitle="Overview of system performance and pending actions."
      />
      {vendor.status === Status.PENDING && (
        <div className="bg-warning-bg border border-warning text-yellow-800 p-4 rounded-xl mb-8 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-200 p-2 rounded-full text-yellow-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg">
                Your institute is pending verification
              </p>
              <p className="text-sm opacity-90">
                Please ensure all your documents are uploaded correctly. Our
                team will review your application shortly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 font-semibold cursor-pointer hover:underline">
            Review Documents <ChevronRightIcon className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Courses"
          value={vendorCourses.length}
          className="p-6"
        />
        <StatCard
          title="Approved Courses"
          value={approvedCount}
          className="p-6"
        />
        <StatCard
          title="Pending Courses"
          value={pendingCount}
          className="p-6"
        />
        <StatCard
          title="Rejected Courses"
          value={rejectedCount}
          className="p-6"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <Card className="p-6 shadow-sm border border-border-color flex flex-col">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Course Status Distribution
          </h3>
          <div className="h-64 w-full flex flex-col items-center justify-center">
            {pieData.length > 0 ? (
              <>
                <div
                  className="w-48 h-48 rounded-full shadow-inner"
                  style={{ background: conicGradient }}
                />
                <div className="flex flex-wrap gap-4 mt-6 justify-center">
                  {pieData.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: d.color }}
                      ></span>
                      <span className="text-text-primary font-medium">
                        {d.name} ({d.value})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-text-tertiary">
                No course data available
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 shadow-sm border border-border-color flex flex-col">
          <h3 className="text-lg font-bold text-text-primary mb-4">
            Top 5 Popular Courses
          </h3>
          <div className="h-64 w-full overflow-y-auto pr-2 custom-scrollbar">
            {barData.length > 0 && barData.some((d) => d.students > 0) ? (
              <div className="flex flex-col space-y-4 pt-1">
                {barData.map((course) => (
                  <div key={course.name} className="w-full group">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span
                        className="font-medium text-text-primary truncate pr-2"
                        title={course.fullTitle}
                      >
                        {course.name}
                      </span>
                      <span className="text-text-secondary text-xs">
                        {course.students} students
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-blue-500 h-3 rounded-full transition-all duration-700 ease-out group-hover:bg-blue-600"
                        style={{
                          width: `${(course.students / maxStudents) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-text-tertiary">
                No enrollment data available
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-text-primary">My Courses</h2>
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <Card className="!p-0 overflow-hidden border-0 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("title")}
                >
                  COURSE NAME {getSortIndicator("title")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("courseCode")}
                >
                  COURSE CODE {getSortIndicator("courseCode")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("type")}
                >
                  COURSE TYPE {getSortIndicator("type")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("mode")}
                >
                  MODE {getSortIndicator("mode")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  STATUS {getSortIndicator("status")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("students")}
                >
                  ENROLLED SEAFARER {getSortIndicator("students")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCourses.length > 0 ? (
                currentCourses.map((c) => {
                  const count = getStudentCount(c.id);
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        {c.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {c.courseCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {c.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            c.mode === "Online"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {c.mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`students?courseId=${c.id}`}
                          className="text-primary font-bold hover:underline"
                        >
                          {count} Seafarers
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => navigate(`${c.id}/edit`)}
                            className="hover:text-primary transition-colors"
                            title="Edit Course"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => navigate(`${c.id}`)}
                            className="hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <ViewIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-text-tertiary"
                  >
                    No courses found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination logic remains the same */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-color flex items-center justify-between bg-gray-50">
            {/* ... pagination buttons ... */}
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, processedCourses.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{processedCourses.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === idx + 1
                          ? "z-10 bg-blue-50 border-primary text-primary"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const StudentEnrollmentView: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterCourseId = queryParams.get("courseId") || "all";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(filterCourseId);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "bookedDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setSelectedCourseId(filterCourseId);
  }, [filterCourseId]);

  // Get Vendor Courses for dropdown
  const vendorCourses = useMemo(() => {
    if (!user || user.role !== Role.VENDOR) return [];
    return courses.filter((c) => c.instituteId === user.id);
  }, [user]);

  // Handle Dropdown Change
  const handleCourseFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newCourseId = e.target.value;
    setSelectedCourseId(newCourseId);
    setCurrentPage(1);
    navigate(`?courseId=${newCourseId}`, { replace: true });
  };

  // 1. Prepare Data
  const rawData = useMemo(() => {
    if (!user || user.role !== Role.VENDOR) return [];

    let filteredEnrollments = enrollments;

    // Filter by Course (Dropdown Logic)
    if (selectedCourseId !== "all") {
      filteredEnrollments = filteredEnrollments.filter(
        (e) => e.courseId === selectedCourseId
      );
    } else {
      // If "all", still only show courses belonging to this vendor
      const vendorCourseIds = vendorCourses.map((c) => c.id);
      filteredEnrollments = filteredEnrollments.filter((e) =>
        vendorCourseIds.includes(e.courseId)
      );
    }

    return filteredEnrollments.map((e) => {
      const student = allUsers.find((u) => u.id === e.userId);
      const course = courses.find((c) => c.id === e.courseId);
      // Mock date if missing or use existing
      const date =
        (e as any).enrollmentDate || new Date().toISOString().split("T")[0];

      return {
        id: e.id || `${e.userId}-${e.courseId}`,
        seafarerName: student?.name || "Unknown User",
        seafarerEmail: student?.email || "N/A",
        seafarerRank: student?.rank || "N/A",
        courseName: course?.title || "Unknown Course",
        bookedDate: date,
        status: e.status,
      };
    });
  }, [selectedCourseId, user, vendorCourses]);

  // 2. Filter & Sort
  const processedData = useMemo(() => {
    let data = [...rawData];

    // Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter((item) =>
        item.seafarerName.toLowerCase().includes(lowerTerm)
      );
    }

    // Sort
    data.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof typeof a];
      const bValue = b[sortConfig.key as keyof typeof b];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return data;
  }, [rawData, searchTerm, sortConfig]);

  // 3. Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const currentData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  if (!user || user.role !== Role.VENDOR) return null;

  return (
    <div>
      <DashboardHeader
        title="Enrolled Seafarers"
        subtitle="View and manage all seafarers enrolled in your institute's courses."
      >
        <Button variant="secondary" onClick={() => navigate("/dashboard")}>
          <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
        </Button>
      </DashboardHeader>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <div className="relative flex-1 w-full max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm shadow-sm"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-full md:w-64">
          <select
            className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg shadow-sm border"
            value={selectedCourseId}
            onChange={handleCourseFilterChange}
          >
            <option value="all">All Courses</option>
            {vendorCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Card className="!p-0 border shadow-sm overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("seafarerName")}
                >
                  SEAFARER NAME {getSortIndicator("seafarerName")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("courseName")}
                >
                  ENROLLED COURSE {getSortIndicator("courseName")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("bookedDate")}
                >
                  BOOKED DATE {getSortIndicator("bookedDate")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-3">
                          {item.seafarerName.charAt(0)}
                        </div>
                        <div className="text-sm font-medium text-text-primary">
                          {item.seafarerName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.courseName}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      {new Date(item.bookedDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-sm text-text-tertiary"
                  >
                    No seafarers found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Logic */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-color flex items-center justify-between bg-gray-50">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, processedData.length)}
                  </span>{" "}
                  of <span className="font-medium">{processedData.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === idx + 1
                          ? "z-10 bg-blue-50 border-primary text-primary"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const VendorCourseManagementView: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | Status>("ALL");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  if (!user || user.role !== Role.VENDOR) return null; // Guard

  const getStudentCount = (courseId: string) =>
    enrollments.filter((e) => e.courseId === courseId).length;

  // Filter Data
  const processedCourses = useMemo(() => {
    let data = courses.filter((c) => c.instituteId === user.id);

    // Filter by Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      data = data.filter(
        (c) =>
          c.title.toLowerCase().includes(lowerTerm) ||
          c.courseCode.toLowerCase().includes(lowerTerm) ||
          c.type.toLowerCase().includes(lowerTerm) ||
          c.mode.toLowerCase().includes(lowerTerm)
      );
    }

    // Filter by Status
    if (filterStatus !== "ALL") {
      data = data.filter((c) => c.status === filterStatus);
    }

    // Sort
    if (sortConfig) {
      data.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof Course];
        let bVal: any = b[sortConfig.key as keyof Course];

        if (sortConfig.key === "students") {
          aVal = getStudentCount(a.id);
          bVal = getStudentCount(b.id);
        }

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [user.id, searchTerm, filterStatus, sortConfig]);

  const totalPages = Math.ceil(processedCourses.length / pageSize);
  const currentCourses = processedCourses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIndicator = (key: string) => {
    if (sortConfig?.key !== key) return null;
    return sortConfig.direction === "asc" ? " ↑" : " ↓";
  };

  const getFilterButtonClass = (status: "ALL" | Status) => {
    const isActive = filterStatus === status;
    return isActive
      ? "px-4 py-1.5 rounded-md bg-white text-primary font-medium text-sm shadow-sm transition-all"
      : "px-4 py-1.5 rounded-md text-text-secondary font-medium text-sm hover:bg-white/50 transition-all";
  };

  return (
    <div>
      <DashboardHeader
        title="Manage Your Courses"
        subtitle="View, edit, and manage all your course listings."
      >
        <Link to="new">
          <Button variant="primary">
            <PlusIcon /> Add New Course
          </Button>
        </Link>
      </DashboardHeader>
      <Card className="!p-0 border-0 shadow-sm">
        <div className="p-4 border-b border-border-color flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search by Title, Code, Type, or Mode"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
            <button
              onClick={() => {
                setFilterStatus("ALL");
                setCurrentPage(1);
              }}
              className={getFilterButtonClass("ALL")}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilterStatus(Status.APPROVED);
                setCurrentPage(1);
              }}
              className={getFilterButtonClass(Status.APPROVED)}
            >
              Approved
            </button>
            <button
              onClick={() => {
                setFilterStatus(Status.PENDING);
                setCurrentPage(1);
              }}
              className={getFilterButtonClass(Status.PENDING)}
            >
              Pending
            </button>
            <button
              onClick={() => {
                setFilterStatus(Status.REJECTED);
                setCurrentPage(1);
              }}
              className={getFilterButtonClass(Status.REJECTED)}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("title")}
                >
                  COURSE NAME {getSortIndicator("title")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("courseCode")}
                >
                  COURSE CODE {getSortIndicator("courseCode")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("type")}
                >
                  COURSE TYPE {getSortIndicator("type")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("mode")}
                >
                  MODE {getSortIndicator("mode")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  STATUS {getSortIndicator("status")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("students")}
                >
                  ENROLLED SEAFARER {getSortIndicator("students")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCourses.length > 0 ? (
                currentCourses.map((c) => {
                  const count = getStudentCount(c.id);
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        {c.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {c.courseCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {c.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            c.mode === "Online"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {c.mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`students?courseId=${c.id}`}
                          className="text-primary font-bold hover:underline"
                        >
                          {count} Seafarers
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => navigate(`${c.id}/edit`)}
                            className="hover:text-primary transition-colors"
                            title="Edit Course"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => navigate(`${c.id}`)}
                            className="hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <ViewIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-text-tertiary"
                  >
                    No courses found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-color flex items-center justify-between bg-gray-50">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, processedCourses.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{processedCourses.length}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === idx + 1
                          ? "z-10 bg-blue-50 border-primary text-primary"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

interface VendorCourseEditorProps {
  mode: "create" | "edit" | "view";
}

const VendorCourseEditor: React.FC<VendorCourseEditorProps> = ({ mode }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Define today's date for validation
  const today = new Date().toISOString().split("T")[0];

  // Find course if in edit or view mode
  const existingCourse =
    mode !== "create" ? courses.find((c) => c.id === courseId) : undefined;

  // Flattened list of all titles for the dropdown
  const allCourseTitles = useMemo(() => {
    const list = Array.isArray(courselist) ? courselist : [];
    // Ensure unique titles
    const titles = list
      .map(
        (c: any) => c["Course Name"] || c.courseName || c.title || c.name || ""
      )
      .filter((t: any) => t && typeof t === "string");
    return Array.from(new Set(titles)).sort();
  }, []);

  // If we're not creating and can't find the course, show error
  if (mode !== "create" && !existingCourse) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800">Course Not Found</h2>
        <p className="text-gray-600 mb-4">
          The course you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/dashboard/courses")}
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  const isReadOnly = mode === "view";
  const pageTitle =
    mode === "create"
      ? "Add a New Course"
      : mode === "edit"
      ? "Edit Course"
      : "Course Details";

  const [formData, setFormData] = useState({
    title: existingCourse?.title || "",
    description: existingCourse?.description || "",
    price: existingCourse?.fee || "",
    currency: "INR",
    duration: existingCourse?.duration || "",
    startDate: existingCourse?.startDate || "",
    endDate: existingCourse?.endDate || "",
    instructor: existingCourse?.instructor || "",
    mode: "Online",
    location: existingCourse?.location || "",
    courseType: (existingCourse as any)?.category || "",
    targetAudience: (existingCourse as any)?.targetAudience || "",
  });

  const [isSuspended, setIsSuspended] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    existingCourse?.imageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handler for title change (auto-populates type and audience)
  const handleTitleSelect = (val: string | string[]) => {
    const selectedTitle = Array.isArray(val) ? val[0] : val;

    // Find metadata
    const list = Array.isArray(courselist) ? courselist : [];
    const courseData = list.find(
      (c: any) =>
        (c["Course Name"] || c.courseName || c.title || c.name) ===
        selectedTitle
    );

    setFormData((prev) => ({
      ...prev,
      title: selectedTitle,
      courseType:
        courseData?.Category || courseData?.category || prev.courseType, // Auto-fill
      targetAudience:
        courseData?.["Target Audience"] || courseData?.targetAudience || "", // Auto-fill
    }));

    // Clear error
    if (errors.title) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) newErrors.title = "Course Title is required";
    if (!formData.courseType) newErrors.courseType = "Course Type is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.mode) newErrors.mode = "Mode is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.price) newErrors.price = "Fees are required";

    // Date Validation
    if (!formData.startDate) {
      newErrors.startDate = "Start Date is required";
    } else if (formData.startDate < today && mode === "create") {
      newErrors.startDate = "Start Date cannot be in the past";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End Date is required";
    } else if (formData.startDate && formData.endDate <= formData.startDate) {
      newErrors.endDate = "End Date must be greater than Start Date";
    }

    if (formData.mode === "Offline" && !formData.location?.trim()) {
      newErrors.location = "Location is required for offline courses";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Proceed with save
      console.log("Saving course...", formData);
      navigate("/dashboard/courses");
    } else {
      // Optional: Scroll to top if needed, or rely on visual cues
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const priceNum = parseFloat(formData.price.toString()) || 0;
  const platformFee = priceNum * 0.2;
  const vendorRevenue = priceNum - platformFee;

  return (
    <div key={courseId}>
      {" "}
      {/* Key ensures re-render if ID changes */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-text-primary">{pageTitle}</h1>
        {mode === "view" && (
          <Button variant="primary-dark" onClick={() => navigate("edit")}>
            <EditIcon className="w-4 h-4 mr-2" /> Edit Course
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Core Details */}
          <div className="bg-white p-8 rounded-xl border border-border-color shadow-sm relative">
            {isReadOnly && (
              <div className="absolute inset-0 z-10 bg-transparent cursor-default" />
            )}
            <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-2">
              Core Details
            </h3>
            <div className="space-y-6">
              {/* Course Title - Primary Selection */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <SearchableDropdown
                  options={allCourseTitles}
                  value={formData.title}
                  onChange={handleTitleSelect}
                  placeholder="Select Course Title"
                  readOnly={isReadOnly}
                  error={!!errors.title}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Course Type - Locked */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Course Type{" "}
                  <span className="text-gray-400 text-xs">(Auto-filled)</span>
                </label>
                <input
                  type="text"
                  value={formData.courseType}
                  readOnly
                  placeholder="Select a title first"
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-text-primary focus:outline-none sm:text-sm cursor-not-allowed"
                />
                {errors.courseType && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.courseType}
                  </p>
                )}
              </div>

              {/* Target Audience - Locked */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Target Audience{" "}
                  <span className="text-gray-400 text-xs">(Auto-filled)</span>
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  readOnly
                  placeholder="Select a title first"
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-text-primary focus:outline-none sm:text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Course Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Provide a detailed description of the course..."
                  className={`block w-full h-32 rounded-md border ${
                    errors.description
                      ? "border-red-500"
                      : "border-border-color"
                  } px-4 py-2 text-text-primary placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                  readOnly={isReadOnly}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white p-8 rounded-xl border border-border-color shadow-sm">
            <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-2">
              Course Thumbnail
            </h3>
            {isReadOnly ? (
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={thumbnailPreview || existingCourse?.imageUrl}
                  alt={formData.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg"
                />
                {thumbnailPreview ? (
                  <div className="w-full h-64 relative">
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadCloudIcon className="w-12 h-12 text-text-tertiary mb-4" />
                    <p className="text-text-primary font-medium">
                      Drag & drop files here
                    </p>
                    <p className="text-sm text-text-secondary mt-1">
                      or click to browse. PNG, JPG up to 5MB.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Logistics */}
          <div className="bg-white p-8 rounded-xl border border-border-color shadow-sm relative">
            {isReadOnly && (
              <div className="absolute inset-0 z-10 bg-transparent cursor-default" />
            )}
            <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-2">
              Logistical Information
            </h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Mode <span className="text-red-500">*</span>
                </label>
                <div className="flex bg-secondary p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() =>
                      !isReadOnly && handleInputChange("mode", "Online")
                    }
                    className={`flex-1 py-2 shadow-sm rounded-md text-sm font-medium transition-colors ${
                      isReadOnly ? "cursor-default" : ""
                    } ${
                      formData.mode === "Online"
                        ? "bg-white text-primary"
                        : "text-text-secondary hover:bg-gray-200"
                    }`}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      !isReadOnly && handleInputChange("mode", "Offline")
                    }
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      isReadOnly ? "cursor-default" : ""
                    } ${
                      formData.mode === "Offline"
                        ? "bg-white text-primary shadow-sm rounded-md"
                        : "text-text-secondary hover:bg-gray-200"
                    }`}
                  >
                    Offline
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Location{" "}
                  {formData.mode === "Offline" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="City, Country or URL"
                  className={`block w-full rounded-md border ${
                    errors.location ? "border-red-500" : "border-border-color"
                  } px-4 py-2 text-text-primary placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                  readOnly={isReadOnly}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-500">{errors.location}</p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  placeholder="5"
                  className={`block w-full rounded-md border ${
                    errors.duration ? "border-red-500" : "border-border-color"
                  } px-4 py-2 text-text-primary placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                  readOnly={isReadOnly}
                />
                <span className="absolute right-4 top-[34px] text-text-secondary text-sm">
                  Days
                </span>
                {errors.duration && (
                  <p className="mt-1 text-xs text-red-500">{errors.duration}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Course Fees <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <SearchableDropdown
                      options={currencyList}
                      value={formData.currency}
                      onChange={(val) => handleInputChange("currency", val)}
                      readOnly={isReadOnly}
                      placeholder="INR"
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                          handleInputChange("price", val);
                        }
                      }}
                      placeholder="7500.00"
                      className={`block w-full rounded-md border ${
                        errors.price ? "border-red-500" : "border-border-color"
                      } px-4 py-2 text-text-primary placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                )}
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="bg-white p-8 rounded-xl border border-border-color shadow-sm relative">
            {isReadOnly && (
              <div className="absolute inset-0 z-10 bg-transparent cursor-default" />
            )}
            <h3 className="text-lg font-bold text-text-primary mb-6 border-b pb-2">
              Scheduling & Staff
            </h3>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  min={today}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  readOnly={isReadOnly || mode === "edit"}
                  placeholder="mm/dd/yyyy"
                  className={`block w-full rounded-md border ${
                    errors.startDate ? "border-red-500" : "border-border-color"
                  } px-4 py-2 text-text-primary placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm ${
                    mode === "edit" ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  min={
                    formData.startDate
                      ? new Date(
                          new Date(formData.startDate).getTime() + 86400000
                        )
                          .toISOString()
                          .split("T")[0]
                      : today
                  }
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  placeholder="mm/dd/yyyy"
                  className={`block w-full rounded-md border ${
                    errors.endDate ? "border-red-500" : "border-border-color"
                  } px-4 py-2 text-text-primary placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                  readOnly={isReadOnly}
                />
                {errors.endDate && (
                  <p className="mt-1 text-xs text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
            <Input
              label="Instructor Name"
              value={formData.instructor}
              onChange={(e) => handleInputChange("instructor", e.target.value)}
              placeholder="e.g., Capt. John Doe"
              readOnly={isReadOnly}
            />
          </div>

          {/* Suspension Option (Edit Mode Only) */}
          {mode === "edit" && (
            <div className="bg-white p-8 rounded-xl border border-red-200 shadow-sm mb-6">
              <h3 className="text-lg font-bold text-red-700 mb-4">
                Course Status
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">
                    {isSuspended ? "Resume Course" : "Suspend Course"}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {isSuspended
                      ? "The course is currently suspended. Click to reactivate and allow new enrollments."
                      : "Suspend this course to prevent new enrollments. Existing students can still access it."}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  className={
                    isSuspended
                      ? "bg-green-600 hover:bg-green-700 text-white border-transparent"
                      : "border-red-300 text-red-600 hover:bg-red-50"
                  }
                  onClick={() => setIsSuspended(!isSuspended)}
                >
                  {isSuspended ? "Reactivate Course" : "Suspend Course"}
                </Button>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            {mode === "view" ? (
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard/courses")}
                className="px-8 py-3"
              >
                Back to List
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/dashboard/courses")}
                  className="px-8 py-3"
                >
                  Reset
                </Button>
                <Button
                  variant="primary-dark"
                  className="px-8 py-3"
                  onClick={handleSubmit}
                >
                  {mode === "create" ? "Create Course" : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="col-span-1">
          <h3 className="font-bold text-text-primary mb-4">
            {mode === "view" ? "Public View" : "Live Preview"}
          </h3>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-border-color sticky top-6">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-50 flex flex-col items-center justify-center border-b border-gray-100">
                <div className="p-3 bg-gray-200 rounded-full mb-2">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  No Image Available
                </span>
              </div>
            )}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-text-primary leading-tight">
                  {formData.title || "Advanced Fire Fighting"}
                </h4>
                <div className="flex flex-col items-end gap-1">
                  <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded font-medium">
                    {formData.mode}
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded font-medium">
                    {formData.courseType || "Category"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                Maritime Institute
              </p>
              <div className="flex items-center gap-4 text-xs text-text-secondary mb-4">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>{" "}
                  {formData.duration || "5"} Days
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" /> Starts{" "}
                  {formData.startDate
                    ? new Date(formData.startDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })
                    : "DD MMM"}
                </div>
              </div>
              <div className="pt-4 border-t border-border-color">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-primary-dark">
                    {formData.currency} {formData.price || "7500"}
                  </span>
                  <span className="text-sm font-medium text-primary cursor-pointer">
                    View Details
                  </span>
                </div>
                {/* Breakdown Display */}
                <div className="mt-3 pt-2 border-t border-dashed border-gray-200">
                  <p className="text-[10px] uppercase text-text-tertiary font-bold mb-1">
                    Fee Breakdown
                  </p>
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>Site Owner (20%)</span>
                    <span>
                      {formData.currency} {platformFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-green-600">
                    <span>Institute Revenue (80%)</span>
                    <span>
                      {formData.currency} {vendorRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD ---
const AdminDashboardView: React.FC = () => {
  const { user } = useAuth();

  // Guard clause
  if (!user || user.role !== Role.ADMIN) return null;

  const totalUsers = allUsers.length;
  const totalVendors = vendors.length;
  const totalCourses = courses.length;
  const pendingVendors = vendors.filter(
    (v) => v.status === Status.PENDING
  ).length;
  const pendingCourses = courses.filter(
    (c) => c.status === Status.PENDING
  ).length;

  return (
    <div>
      <DashboardHeader
        title={`Admin Dashboard`}
        subtitle="Overview of system performance and pending actions."
      />

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<UsersIcon />}
          className="p-6"
        />
        <StatCard
          title="Registered Vendors"
          value={totalVendors}
          icon={<VendorsIcon />}
          className="p-6"
        />
        <StatCard
          title="Total Courses"
          value={totalCourses}
          icon={<CoursesIcon />}
          className="p-6"
        />
        <StatCard
          title="Pending Actions"
          value={pendingVendors + pendingCourses}
          icon={<HourglassIcon />}
          className="p-6"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm !p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-text-primary">
              Pending Vendors
            </h3>
          </div>
          <div className="space-y-3">
            {vendors.filter((v) => v.status === Status.PENDING).length > 0 ? (
              vendors
                .filter((v) => v.status === Status.PENDING)
                .slice(0, 5)
                .map((v) => (
                  <div
                    key={v.id}
                    className="flex justify-between items-center p-3 bg-secondary rounded-lg"
                  >
                    <div>
                      <p className="font-bold text-sm text-text-primary">
                        {v.name}
                      </p>
                      <p className="text-xs text-text-secondary">{v.email}</p>
                    </div>
                    <StatusBadge status={v.status} />
                  </div>
                ))
            ) : (
              <p className="text-text-secondary text-sm">
                No pending vendor applications.
              </p>
            )}
          </div>
        </Card>

        <Card className="border-0 shadow-sm !p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-text-primary">
              System Stats
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">System Status</span>
              <span className="text-success font-bold text-sm">Healthy</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">
                Database Connection
              </span>
              <span className="text-success font-bold text-sm">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Last Backup</span>
              <span className="text-text-primary font-bold text-sm">
                Today, 04:00 AM
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  if (user.role === Role.ADMIN) return <AdminDashboardView />;
  if (user.role === Role.VENDOR) return <VendorDashboardView />;
  return <UserDashboardView />;
};

const DashboardPages: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="profile" element={<UserProfileView />} />
      <Route path="courses" element={<VendorCourseManagementView />} />
      <Route path="students" element={<StudentEnrollmentView />} />
      <Route path="courses/students" element={<StudentEnrollmentView />} />
      <Route
        path="courses/new"
        element={<VendorCourseEditor mode="create" />}
      />
      <Route
        path="courses/:courseId"
        element={<VendorCourseEditor mode="view" />}
      />
      <Route
        path="courses/:courseId/edit"
        element={<VendorCourseEditor mode="edit" />}
      />
    </Routes>
  );
};

export default DashboardPages;
