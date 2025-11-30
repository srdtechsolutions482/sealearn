import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Input,
  Button,
  Textarea,
  UploadCloudIcon,
  FileIcon,
  TrashIcon,
  LockIcon,
} from "../components/ui";
import containership from "../assets/ContainerShip.jpg";

const LogoAnchorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6 text-primary"
  >
    <path d="M12 22V8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    <circle cx="12" cy="5" r="3" />
  </svg>
);

const AuthLayout: React.FC<{
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}> = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
    <div className="grid md:grid-cols-2 max-w-5xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden min-h-[600px]">
      <div className="hidden md:block relative">
        <img
          src={containership}
          alt="Container Ship"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20"></div>
      </div>
      <div className="p-10 flex flex-col justify-center">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-primary-dark leading-tight">
            {title}
          </h2>
          {subtitle && <p className="text-text-secondary mt-2">{subtitle}</p>}
        </div>
        <div className="flex-1 flex flex-col justify-center">{children}</div>
        <div className="mt-auto text-center text-xs text-text-tertiary pt-6">
          <p>© 2024 SeaLearn Platform. All Rights Reserved.</p>
          <p className="mt-1 text-accent-orange cursor-pointer hover:underline">
            Help & Support
          </p>
        </div>
      </div>
    </div>
  </div>
);

const Header: React.FC = () => (
  <header className="bg-white border-b border-border-color sticky top-0 z-10">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <LogoAnchorIcon />
        <span className="text-lg font-bold text-text-primary">SeaLearn</span>
      </Link>
      <Link to="/login">
        <Button variant="primary" size="sm" className="px-6">
          Login
        </Button>
      </Link>
    </div>
  </header>
);

const Footer: React.FC = () => (
  <footer className="py-6 text-center text-sm text-text-tertiary">
    <div className="flex justify-center gap-6 mb-2">
      <a href="#" className="hover:text-text-secondary">
        Terms of Service
      </a>
      <a href="#" className="hover:text-text-secondary">
        Privacy Policy
      </a>
      <a href="#" className="hover:text-text-secondary">
        Contact Us
      </a>
    </div>
  </footer>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  // Simulate a portal title change if user starts typing admin email
  const isAdmin = email.includes("admin");
  const title = isAdmin
    ? "Super Administrator Portal"
    : "Welcome Back, Seafarer";
  const subtitle = isAdmin
    ? "Welcome Back, Administrator"
    : "Enter your credentials to access your courses.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-danger bg-danger-bg p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <Input
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@test.com"
          icon={
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          required
        />
        <div className="relative">
          <Input
            label="Password"
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            required
            icon={<LockIcon className="w-5 h-5" />}
          />
          <button
            type="button"
            className="absolute right-3 top-[34px] text-text-tertiary hover:text-text-primary"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <a href="#" className="text-accent-orange hover:underline ml-auto">
            Forgot Password?
          </a>
        </div>
        <Button
          type="submit"
          variant="primary-dark"
          className="w-full !py-3 !text-base mt-2"
        >
          Login
        </Button>
      </form>
      {!isAdmin && (
        <p className="text-center text-sm text-text-secondary mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary-dark hover:underline"
          >
            Sign Up
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-0 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
          <div className="bg-primary-dark p-12 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Your Voyage to Certification Starts Here.
              </h1>
              <p className="text-gray-300 text-lg">
                Access DG Shipping-approved courses and advance your maritime
                career with our trusted platform.
              </p>
            </div>
            {/* Subtle background pattern */}
            <svg
              className="absolute top-0 left-0 w-full h-full opacity-5"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
          </div>
          <div className="p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-text-primary mb-2">
              Create Your Seafarer Account
            </h2>
            <p className="text-text-secondary mb-8">
              Join thousands of seafarers on their voyage to certification.
            </p>
            <UserRegisterForm />

            <div className="mt-6 text-center border-t border-border-color pt-6">
              <p className="text-sm text-text-secondary mt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const VendorRegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-text-primary">
              Register Your Institute
            </h1>
            <p className="text-text-secondary mt-2">
              Join our platform to offer DG Shipping-approved courses to
              thousands of seafarers.
            </p>
          </div>
          <VendorRegisterForm />
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const UserRegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = useState("");
  return (
    <form className="space-y-5">
      <p className="text-right text-xs text-text-tertiary">
        <span className="text-danger">*</span> Indicates mandatory fields
      </p>
      <Input
        label={
          <span>
            Full Name <span className="text-danger">*</span>
          </span>
        }
        id="name"
        placeholder="Enter your full name"
        type="text"
        required
      />
      <Input
        label={
          <span>
            Email Address <span className="text-danger">*</span>
          </span>
        }
        id="email"
        placeholder="Enter your email address"
        type="email"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Mobile Number"
          id="mobile"
          placeholder="+91 Enter your mobile number"
          type="tel"
        />
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Rank
          </label>
          <select className="w-full px-4 py-2.5 border border-border-color rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white">
            <option>Select your rank</option>
            <option>Deck Cadet</option>
            <option>Captain</option>
            <option>Chief Engineer</option>
          </select>
        </div>
      </div>
      <div className="relative">
        <Input
          label={
            <span>
              Password <span className="text-danger">*</span>
            </span>
          }
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          required
          icon={<LockIcon className="w-5 h-5" />}
        />
        <button
          type="button"
          className="absolute right-3 top-[34px] text-text-tertiary hover:text-text-primary"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      <Button
        type="submit"
        variant="primary-dark"
        className="w-full !py-3 !text-base mt-2"
      >
        Create My Account
      </Button>
    </form>
  );
};

const VendorRegisterForm: React.FC = () => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isDeclared, setIsDeclared] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [otherCourse, setOtherCourse] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const COURSE_OPTIONS = [
    "Basic Safety Training (BST)",
    "Proficiency in Survival Craft (PSCRB)",
    "Advanced Fire Fighting (AFF)",
    "Medical First Aid (MFA)",
    "Global Maritime Distress Safety System (GMDSS)",
    "Radar Observer Course (ROC)",
    "Automatic Radar Plotting Aids (ARPA)",
    "Engine Room Simulator (ERS)",
    "Liquid Cargo Handling Simulator (LCHS)",
    "High Voltage Safety (HV)",
    "Dynamic Positioning Induction",
    "Ship Security Officer (SSO)",
    "Other",
  ];

  const toggleCourse = (course: string) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses((prev) => prev.filter((c) => c !== course));
      if (course === "Other") {
        setOtherCourse("");
        setErrors((prev) => ({ ...prev, otherCourse: "" }));
      }
    } else {
      setSelectedCourses((prev) => [...prev, course]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      setErrors((prev) => ({ ...prev, files: "" }));
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const validFiles = droppedFiles.filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validFiles.length < droppedFiles.length) {
        alert("Only PDF, JPEG, and PNG files are allowed.");
      }

      setFiles((prev) => [...prev, ...validFiles]);
      setErrors((prev) => ({ ...prev, files: "" }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const formData = new FormData(e.currentTarget);

    // Validate Required Text Fields
    const requiredFields = [
      { key: "instituteName", label: "Institute Name" },
      { key: "accreditation", label: "Accreditation Number" },
      { key: "address", label: "Institute Address" },
      { key: "contactPerson", label: "Contact Person" },
      { key: "contactMobile", label: "Phone Number" },
      { key: "contactEmail", label: "Email" },
      { key: "licenseNumber", label: "License Number" },
      { key: "issuingAuthority", label: "Issuing Authority" },
      { key: "validFrom", label: "Vendor Approval Date" },
      { key: "validUntil", label: "Valid Until Date" },
    ];

    requiredFields.forEach(({ key, label }) => {
      const value = formData.get(key);
      if (!value || value.toString().trim() === "") {
        newErrors[key] = `${label} is required`;
      }
    });

    if (selectedCourses.includes("Other") && !otherCourse.trim()) {
      newErrors["otherCourse"] = "Please specify the other course.";
    }

    // Validate Files
    if (files.length === 0) {
      newErrors["files"] =
        "Please upload the required documentation (Resolution Copy or Accreditation Certificate).";
    }

    // Validate Self Declaration
    if (!isDeclared) {
      newErrors["selfDeclaration"] = "You must accept the self declaration.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Find first error and scroll to it
      const firstErrorKey = Object.keys(newErrors)[0];
      const elementId =
        firstErrorKey === "files"
          ? "files-section"
          : firstErrorKey === "selfDeclaration"
          ? "declaration-section"
          : firstErrorKey;
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    alert("Application submitted successfully!");
  };

  const getInputErrorClass = (name: string) => {
    return errors[name]
      ? "!border-danger !focus:border-danger !focus:ring-danger"
      : "";
  };

  const renderErrorMsg = (name: string) => {
    return errors[name] ? (
      <p className="text-danger text-xs mt-1">{errors[name]}</p>
    ) : null;
  };

  const filteredCourses = COURSE_OPTIONS.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
      <p className="text-right text-xs text-text-tertiary mb-2">
        <span className="text-danger">*</span> Indicates mandatory fields
      </p>

      {/* Institute Profile */}
      <section>
        <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-color">
          Institute Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label={
                <span>
                  Institute Name <span className="text-danger">*</span>
                </span>
              }
              id="instituteName"
              name="instituteName"
              placeholder="Enter the full name of your institute"
              type="text"
              className={getInputErrorClass("instituteName")}
              onChange={() =>
                setErrors((prev) => ({ ...prev, instituteName: "" }))
              }
            />
            {renderErrorMsg("instituteName")}
          </div>
          <div>
            <Input
              label={
                <span>
                  Accreditation Number <span className="text-danger">*</span>
                </span>
              }
              id="accreditation"
              name="accreditation"
              placeholder="Enter your official accreditation number"
              type="text"
              className={getInputErrorClass("accreditation")}
              onChange={() =>
                setErrors((prev) => ({ ...prev, accreditation: "" }))
              }
            />
            {renderErrorMsg("accreditation")}
          </div>
          <div className="md:col-span-2">
            <Textarea
              label={
                <span>
                  Institute Address <span className="text-danger">*</span>
                </span>
              }
              id="address"
              name="address"
              placeholder="Enter full physical address"
              rows={3}
              className={`w-full ${getInputErrorClass("address")}`}
              onChange={() => setErrors((prev) => ({ ...prev, address: "" }))}
            />
            {renderErrorMsg("address")}
          </div>
        </div>
      </section>

      {/* Contact Details */}
      <section>
        <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-color">
          Contact Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label={
                <span>
                  Contact Person <span className="text-danger">*</span>
                </span>
              }
              id="contactPerson"
              name="contactPerson"
              placeholder="Enter contact person name"
              type="text"
              className={getInputErrorClass("contactPerson")}
              onChange={() =>
                setErrors((prev) => ({ ...prev, contactPerson: "" }))
              }
            />
            {renderErrorMsg("contactPerson")}
          </div>
          <div>
            <Input
              label={
                <span>
                  Phone Number <span className="text-danger">*</span>
                </span>
              }
              id="contactMobile"
              name="contactMobile"
              placeholder="Enter phone number"
              type="tel"
              className={getInputErrorClass("contactMobile")}
              onChange={() =>
                setErrors((prev) => ({ ...prev, contactMobile: "" }))
              }
            />
            {renderErrorMsg("contactMobile")}
          </div>
          <div className="md:col-span-2">
            <Input
              label={
                <span>
                  Email <span className="text-danger">*</span>
                </span>
              }
              id="contactEmail"
              name="contactEmail"
              placeholder="Enter official email address"
              type="email"
              className={getInputErrorClass("contactEmail")}
              onChange={() =>
                setErrors((prev) => ({ ...prev, contactEmail: "" }))
              }
            />
            {renderErrorMsg("contactEmail")}
          </div>
        </div>
      </section>

      {/* License & Approval Details */}
      <section>
        <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-color">
          License Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label={
                <span>
                  License Number <span className="text-danger">*</span>
                </span>
              }
              id="licenseNumber"
              name="licenseNumber"
              placeholder="Enter official license number"
              type="text"
              className={getInputErrorClass("licenseNumber")}
              onChange={() =>
                setErrors((prev) => ({ ...prev, licenseNumber: "" }))
              }
            />
            {renderErrorMsg("licenseNumber")}
          </div>
          <div>
            <Input
              label={
                <span>
                  Issuing Authority <span className="text-danger">*</span>
                </span>
              }
              id="issuingAuthority"
              name="issuingAuthority"
              placeholder="e.g. DG Shipping"
              type="text"
              className={getInputErrorClass("issuingAuthority")}
              onChange={() =>
                setErrors((prev) => ({ ...prev, issuingAuthority: "" }))
              }
            />
            {renderErrorMsg("issuingAuthority")}
          </div>
        </div>
      </section>

      {/* Course Details (Multiselect) */}
      <section>
        <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-color">
          Course Offerings
        </h3>
        <div className="relative">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Select Courses Offered
          </label>

          {/* Custom Multiselect Input */}
          <div
            className={`min-h-[46px] w-full px-3 py-2 border rounded-lg shadow-sm bg-white cursor-pointer flex flex-wrap gap-2 items-center transition-all ${
              isDropdownOpen
                ? "ring-2 ring-primary/20 border-primary"
                : "border-border-color hover:border-gray-400"
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCourses.length === 0 && (
              <span className="text-text-tertiary text-sm px-1">
                Select courses from the list...
              </span>
            )}

            {selectedCourses.map((course) => (
              <span
                key={course}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary-dark border border-primary/20"
              >
                {course}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCourse(course);
                  }}
                  className="hover:bg-primary/20 rounded-full p-0.5 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </div>
              </span>
            ))}

            <div className="ml-auto text-text-tertiary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Dropdown Options */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              <div className="absolute z-20 w-full mt-2 bg-white border border-border-color rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                <div
                  className="p-2 border-b border-gray-100 bg-gray-50 sticky top-0 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-border-color rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((option) => {
                      const isSelected = selectedCourses.includes(option);
                      return (
                        <div
                          key={option}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                            isSelected ? "bg-primary/5" : "hover:bg-gray-50"
                          }`}
                          onClick={() => toggleCourse(option)}
                        >
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              isSelected
                                ? "text-primary-dark font-medium"
                                : "text-text-primary"
                            }`}
                          >
                            {option}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-text-tertiary text-center">
                      No courses found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Other Course Input */}
          {selectedCourses.includes("Other") && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <Input
                label={
                  <span>
                    Specify Other Course <span className="text-danger">*</span>
                  </span>
                }
                id="otherCourse"
                value={otherCourse}
                onChange={(e) => {
                  setOtherCourse(e.target.value);
                  setErrors((prev) => ({ ...prev, otherCourse: "" }));
                }}
                placeholder="Enter the name of the new course"
                className={getInputErrorClass("otherCourse")}
                required
              />
              {renderErrorMsg("otherCourse")}
            </div>
          )}
        </div>
      </section>

      {/* Documentation */}
      <section id="files-section">
        <h3 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border-color">
          Documentation
        </h3>
        <label className="block text-sm font-medium text-text-secondary mb-3">
          Upload Resolution Copy (IMO / DG Shipping) or Accreditation
          Certificate <span className="text-danger">*</span>
        </label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf, .jpg, .jpeg, .png"
          multiple
        />
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
            errors.files
              ? "border-danger bg-red-50"
              : "border-primary/30 bg-primary-light/10 hover:bg-primary-light/20"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex justify-center mb-3">
            <UploadCloudIcon
              className={`h-10 w-10 ${
                errors.files ? "text-danger" : "text-primary"
              } opacity-60`}
            />
          </div>
          <p
            className={`${
              errors.files ? "text-danger" : "text-primary"
            } font-semibold`}
          >
            Click to upload{" "}
            <span className="text-text-secondary font-normal">
              or drag and drop
            </span>
          </p>
          <p className="text-xs text-text-tertiary mt-1">
            PDF, JPEG, PNG (MAX. 5MB) - You can upload multiple files
          </p>
        </div>
        {renderErrorMsg("files")}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-4 space-y-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border-color"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium text-text-primary truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-text-tertiary flex-shrink-0">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-text-tertiary hover:text-danger ml-2"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Self Declaration */}
      <section id="declaration-section">
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            errors.selfDeclaration
              ? "border-danger bg-red-50"
              : "border-border-color bg-secondary/50"
          }`}
        >
          <div className="flex h-6 items-center">
            <input
              id="selfDeclaration"
              name="selfDeclaration"
              type="checkbox"
              checked={isDeclared}
              onChange={(e) => {
                setIsDeclared(e.target.checked);
                setErrors((prev) => ({ ...prev, selfDeclaration: "" }));
              }}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="text-sm">
            <label
              htmlFor="selfDeclaration"
              className={`font-medium ${
                errors.selfDeclaration ? "text-danger" : "text-text-primary"
              }`}
            >
              Self Declaration <span className="text-danger">*</span>
            </label>
            <p className="text-text-secondary mt-1">
              I hereby declare that the information provided above is true and
              correct to the best of my knowledge. I understand that providing
              false information may lead to the rejection of this application or
              revocation of approval.
            </p>
            {renderErrorMsg("selfDeclaration")}
          </div>
        </div>
      </section>

      <div className="pt-4">
        <Button type="submit" className="w-full !py-3 !text-base">
          Register
        </Button>
      </div>
    </form>
  );
};

const AuthPages: React.FC = () => {
  const location = useLocation();

  if (location.pathname === "/login") {
    return <LoginPage />;
  }

  if (location.pathname === "/register-vendor") {
    return <VendorRegisterPage />;
  }

  // Default to User Registration for /register
  return <RegisterPage />;
};

export default AuthPages;
