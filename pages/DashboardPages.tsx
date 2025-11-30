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
import { vendors, courses, enrollments, allUsers } from "../data";
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

// --- MOCK DATA FOR COURSE NAMES ---
const courseNameList = [
  "Advanced Fire Fighting",
  "Basic Safety Training",
  "Medical First Aid",
  "Proficiency in Survival Craft and Rescue Boats",
  "Security Training for Seafarers with Designated Security Duties",
  "Global Maritime Distress and Safety System (GMDSS)",
  "Radar Observer Course",
  "Automatic Radar Plotting Aids (ARPA)",
  "Bridge Team Management",
  "Engine Room Resource Management",
  "High Voltage Safety and Switch Gear",
  "Tanker Familiarization",
  "Ship Security Officer",
  "Medical Care",
  "Passenger Ship Crisis Management",
];

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
              <button className="absolute bottom-0 right-0 bg-primary-dark text-white p-2 rounded-full hover:bg-primary transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
            <p className="text-text-secondary">{user.rank}</p>

            <Button variant="primary-dark" className="mt-6 w-full py-3">
              Edit Profile
            </Button>
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
                  {/* <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircleIcon className="w-3 h-3"/> Verified</span> */}
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
              <Button variant="primary">
                <PlusIcon className="w-4 h-4" /> Upload New
              </Button>
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
                  <button className="p-2 hover:text-primary">
                    <EditIcon />
                  </button>
                  <button className="p-2 hover:text-danger">
                    <TrashIcon />
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
                  <button className="p-2 hover:text-primary">
                    <EditIcon />
                  </button>
                  <button className="p-2 hover:text-danger">
                    <TrashIcon />
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

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
          title="Status"
          value={
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  vendor.status === Status.PENDING ? "bg-warning" : "bg-success"
                }`}
              ></span>
              {vendor.status}
            </div>
          }
          className="p-6"
        />
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
          title="Rejected Courses"
          value={rejectedCount}
          className="p-6"
        />
      </div>

      <h2 className="text-2xl font-bold text-text-primary mb-4">My Courses</h2>
      <Card className="!p-0 overflow-hidden border-0 shadow-sm">
        <DataTable
          columns={[
            { header: "COURSE NAME", accessor: "title" },
            {
              header: "STATUS",
              accessor: (c) => <StatusBadge status={c.status} />,
            },
            {
              header: "ENROLLMENTS",
              accessor: (c) => Math.floor(Math.random() * 200),
            },
            {
              header: "",
              accessor: (c) => (
                <button
                  onClick={() => navigate(`courses/${c.id}`)}
                  className="text-primary font-medium hover:underline"
                >
                  Manage
                </button>
              ),
            },
          ]}
          data={vendorCourses}
        />
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

  if (!user || user.role !== Role.VENDOR) return null; // Guard

  // Filter Data
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => c.instituteId === user.id)
      .filter((course) => {
        const matchesSearch =
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filterStatus === "ALL" || course.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
  }, [user.id, searchTerm, filterStatus]);

  const columns: Column<Course>[] = [
    { header: "COURSE ID", accessor: "courseCode" },
    { header: "COURSE TITLE", accessor: "title" },
    {
      header: "STATUS",
      accessor: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "FEES",
      accessor: (item) => `₹${item.fee.toLocaleString("en-IN")}`,
    },
    {
      header: "ACTIONS",
      accessor: (course) => (
        <div className="flex items-center space-x-3 text-text-secondary">
          <button
            onClick={() => navigate(`${course.id}/edit`)}
            className="hover:text-primary transition-colors"
            title="Edit Course"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => navigate(`${course.id}`)}
            className="hover:text-primary transition-colors"
            title="View Details"
          >
            <ViewIcon />
          </button>
        </div>
      ),
    },
  ];

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
              placeholder="Search by Course Title or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={getFilterButtonClass("ALL")}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus(Status.APPROVED)}
              className={getFilterButtonClass(Status.APPROVED)}
            >
              Approved
            </button>
            <button
              onClick={() => setFilterStatus(Status.PENDING)}
              className={getFilterButtonClass(Status.PENDING)}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus(Status.REJECTED)}
              className={getFilterButtonClass(Status.REJECTED)}
            >
              Rejected
            </button>
          </div>
        </div>
        <DataTable columns={columns} data={filteredCourses} />
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

  // Find course if in edit or view mode
  const existingCourse =
    mode !== "create" ? courses.find((c) => c.id === courseId) : undefined;

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
    startDate: "",
    endDate: "",
    instructor: existingCourse?.instructor || "",
    mode: "Online",
    location: existingCourse?.location || "",
    courseType: "Beginner",
  });

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
    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";

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
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <SearchableDropdown
                  options={courseNameList}
                  value={formData.title}
                  onChange={(val) => handleInputChange("title", val)}
                  placeholder="Select Course Title"
                  readOnly={isReadOnly}
                  error={!!errors.title}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Course Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.courseType}
                  onChange={(e) =>
                    handleInputChange("courseType", e.target.value)
                  }
                  className={`block w-full rounded-md border ${
                    errors.courseType ? "border-red-500" : "border-border-color"
                  } bg-white px-4 py-2 text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                  disabled={isReadOnly}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                {errors.courseType && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.courseType}
                  </p>
                )}
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
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="7500"
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
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  placeholder="mm/dd/yyyy"
                  className={`block w-full rounded-md border ${
                    errors.startDate ? "border-red-500" : "border-border-color"
                  } px-4 py-2 text-text-primary placeholder-text-tertiary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`}
                  readOnly={isReadOnly}
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
                  Cancel
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
            <img
              src={
                thumbnailPreview ||
                existingCourse?.imageUrl ||
                "https://images.unsplash.com/photo-1559024926-751d3b13e873?q=80&w=2070&auto=format&fit=crop"
              }
              alt="Preview"
              className="w-full h-48 object-cover"
            />
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
                    {formData.courseType}
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
