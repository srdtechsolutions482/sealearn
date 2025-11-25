export enum Role {
  USER = 'user',
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

export enum Status {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ACTIVE = 'Active',
  DISABLED = 'Disabled',
  INTEREST_REGISTERED = 'Interest Registered',
  VERIFIED = 'Verified',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  rank?: string; // e.g., "Deck Cadet"
  profilePictureUrl?: string;
  phone?: string;
}

export interface Vendor extends User {
  role: Role.VENDOR;
  instituteName: string;
  accreditationNo: string;
  address: string;
  contactPerson: string;
  documents: { name: string, url: string, size: string, uploadedDate: string }[];
  status: Status.PENDING | Status.APPROVED | Status.REJECTED;
  submissionDate?: string;
}

export interface Course {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  instituteId: string;
  instituteName: string;
  duration: string; // e.g., "5 days"
  fee: number;
  location: string;
  type: 'Online' | 'Offline';
  // FIX: Added Status.APPROVED to allow courses to have this status.
  status: Status.ACTIVE | Status.PENDING | Status.REJECTED | Status.DISABLED | Status.APPROVED;
  seats: number;
  startDate: string;
  imageUrl?: string;
  isDGApproved: boolean;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
}