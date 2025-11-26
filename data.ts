import { User, Vendor, Course, Enrollment, Role, Status } from './types';

// A single source of truth for all authenticatable entities.
export const allUsers: (User | Vendor)[] = [
  // User
  { id: 'u1', name: 'Raj Kumar', email: 'user@example.com', password: 'password', role: Role.USER, rank: 'Deck Cadet', profilePictureUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3387&auto=format&fit=crop', phone: '9876543210' },
  // Admin
  { id: 'a1', name: 'Alex Johnson', email: 'admin@example.com', password: 'password', role: Role.ADMIN, profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop', phone: '+1 234 567 890' },
  // Vendors
  { 
    id: 'v1', 
    name: 'BlueWave Maritime Academy', 
    email: 'vendor@example.com', 
    password: 'password', 
    role: Role.VENDOR, 
    instituteName: 'BlueWave Maritime',
    accreditationNo: 'DG-S-ACCRED-1138',
    address: '123 Ocean Drive, Mumbai, India',
    contactPerson: 'Capt. Sharma',
    documents: [
      { name: 'accreditation.pdf', url: '#', size: '1.2MB', uploadedDate: '12 Jan 2024' }
    ], 
    status: Status.APPROVED,
    submissionDate: '2023-10-15'
  },
  { 
    id: 'v2', 
    name: 'Seafarer\'s Choice Institute', 
    email: 'vendor2@example.com', 
    password: 'password', 
    role: Role.VENDOR, 
    instituteName: 'Seafarer\'s Choice',
    accreditationNo: 'DG-S-ACCRED-1150',
    address: '456 Marine Parade, Chennai, India',
    contactPerson: 'Ms. Priya Singh',
    documents: [
        { name: 'Incorporation Certificate.pdf', url: '#', size: '1.2MB', uploadedDate: '26 Oct 2023' },
        { name: 'DG Shipping License.pdf', url: '#', size: '850KB', uploadedDate: '26 Oct 2023' }
    ], 
    status: Status.PENDING,
    submissionDate: '2023-10-26'
  },
  { 
    id: 'v3', 
    name: 'Poseidon Training Center', 
    email: 'vendor3@example.com', 
    password: 'password', 
    role: Role.VENDOR, 
    instituteName: 'Poseidon Training',
    accreditationNo: 'DG-S-ACCRED-1192',
    address: '789 Port Road, Kolkata, India',
    contactPerson: 'Mr. Anik Das',
    documents: [
        { name: 'Audit Report.pdf', url: '#', size: '2.5MB', uploadedDate: '15 Nov 2023' }
    ], 
    status: Status.PENDING,
    submissionDate: '2023-10-25'
  },
   { 
    id: 'v4', 
    name: 'Nautical Skills Inc.', 
    email: 'vendor4@example.com', 
    password: 'password', 
    role: Role.VENDOR, 
    instituteName: 'Nautical Skills Inc.',
    accreditationNo: 'DG-S-ACCRED-1205',
    address: '101 Coastline Ave, Goa, India',
    contactPerson: 'Mr. Fernandes',
    documents: [], 
    status: Status.PENDING,
    submissionDate: '2023-10-24'
  },
];

// Derived arrays for components that need specific roles.
export const users: User[] = allUsers.filter(u => u.role === Role.USER || u.role === Role.ADMIN);
export const vendors: Vendor[] = allUsers.filter(u => u.role === Role.VENDOR) as Vendor[];


export const courses: Course[] = [
  { id: 'c1', courseCode: 'STCW-001', title: 'STCW Basic Safety Training', instituteId: 'v1', instituteName: 'BlueWave Maritime', duration: '5 days', fee: 4500, location: 'Mumbai, India', type: 'Offline', status: Status.APPROVED, seats: 20, startDate: '2024-08-01', description: 'Comprehensive basic safety training as per STCW convention.', imageUrl: 'assets/STCWBasicSafetyTraining.jpeg', isDGApproved: true },
  { id: 'c2', courseCode: 'AD-C-002', title: 'Advanced Fire Fighting', instituteId: 'v2', instituteName: 'Seafarer\'s Choice', duration: '3 days', fee: 8000, location: 'Chennai, India', type: 'Offline', status: Status.PENDING, seats: 15, startDate: '2024-08-10', description: 'Advanced techniques for fire fighting on board ships.', imageUrl: 'assets/AdvancedFireFighting.jpg', isDGApproved: true },
  { id: 'c3', courseCode: 'MED-A-003', title: 'Medical First Aid', instituteId: 'v3', instituteName: 'Poseidon Training', duration: '4 days', fee: 6200, location: 'Kolkata, India', type: 'Offline', status: Status.REJECTED, seats: 30, startDate: '2024-09-01', description: 'Essential medical first aid skills for seafarers.', imageUrl: 'assets/MedicalFirstAid.jpg', isDGApproved: true },
  { id: 'c4', courseCode: 'PSC-001', title: 'Proficiency in Survival Craft', instituteId: 'v4', instituteName: 'Nautical Skills Inc.', duration: '4 days', fee: 6200, location: 'Goa, India', type: 'Offline', status: Status.APPROVED, seats: 20, startDate: '2024-08-15', description: 'Training for survival craft and rescue boats operations.', imageUrl: 'assets/ProficiencyInSurvivalCraft.jpg', isDGApproved: true },
  { id: 'c5', courseCode: 'RADAR-01', title: 'Radar & ARPA Simulation', instituteId: 'v1', instituteName: 'BlueWave Maritime Academy', duration: '10 days', fee: 9500, location: 'Online', type: 'Online', status: Status.APPROVED, seats: 12, startDate: '2024-09-05', description: 'Simulator-based training for radar observation.', imageUrl: 'assets/Radar&ARPASimulation.jpg', isDGApproved: true },
  { id: 'c6', courseCode: 'PSSR-C', title: 'PST & PSSR Combined', instituteId: 'v2', instituteName: 'Seafarer\'s Choice Institute', duration: '5 days', fee: 5000, location: 'Worldwide', type: 'Online', status: Status.APPROVED, seats: 25, startDate: '2024-07-20', description: 'Personal Survival Techniques & Personal Safety and Social Responsibilities.', imageUrl: 'assets/PST&PSSRCombined.jpg', isDGApproved: true },
  { id: 'c7', courseCode: 'MAR-004', title: 'Ship Security Officer', instituteId: 'v4', instituteName: 'Seven Seas Academy', duration: '4 days', fee: 6200, location: 'Chennai, India', type: 'Offline', status: Status.APPROVED, seats: 20, startDate: '2024-09-15', description: 'Understand and implement the ship security plan under the ISPS code.', imageUrl: 'assets/ShipSecurityOfficer.jpg', isDGApproved: true },
  { id: 'c8', courseCode: 'GMDSS-01', title: 'GMDSS General Operator\'s', instituteId: 'v1', instituteName: 'BlueWave Maritime', duration: '12 days', fee: 15000, location: 'Mumbai, India', type: 'Offline', status: Status.APPROVED, seats: 10, startDate: '2024-10-01', description: 'Global Maritime Distress and Safety System training.', imageUrl: 'assets/GMDSSGeneralOperator.jpg', isDGApproved: true },
  { id: 'c9', courseCode: 'ECDIS-01', title: 'ECDIS Type-Specific', instituteId: 'v1', instituteName: 'BlueWave Maritime', duration: '2 days', fee: 8500, location: 'Online', type: 'Online', status: Status.APPROVED, seats: 50, startDate: '2024-08-25', description: 'Electronic Chart Display and Information System training.', imageUrl: 'assets/ECDISType-Specific.jpg', isDGApproved: true },
  { id: 'c10', courseCode: 'BTM-01', title: 'Bridge Team Management', instituteId: 'v3', instituteName: 'Poseidon Training', duration: '5 days', fee: 12000, location: 'Kolkata, India', type: 'Offline', status: Status.APPROVED, seats: 15, startDate: '2024-09-10', description: 'Enhance bridge resource management skills.', imageUrl: 'assets/BridgeTeamManagement.jpg', isDGApproved: true },
  { id: 'c11', courseCode: 'ERM-01', title: 'Engine Room Resource Mgt', instituteId: 'v2', instituteName: 'Seafarer\'s Choice', duration: '5 days', fee: 11000, location: 'Chennai, India', type: 'Offline', status: Status.APPROVED, seats: 15, startDate: '2024-09-20', description: 'Resource management for engine room personnel.', imageUrl: 'assets/EngineRoomResourceMgt.jpg', isDGApproved: true },
  { id: 'c12', courseCode: 'CHEM-01', title: 'Chemical Tanker Familiarization', instituteId: 'v4', instituteName: 'Nautical Skills Inc.', duration: '6 days', fee: 9000, location: 'Goa, India', type: 'Offline', status: Status.APPROVED, seats: 20, startDate: '2024-10-05', description: 'Basic training for chemical tanker operations.', imageUrl: 'assets/ChemicalTankerFamiliarization.jpg', isDGApproved: true },
];

export const enrollments: Enrollment[] = [
  { id: 'e1', userId: 'u1', courseId: 'c1', enrollmentDate: '2024-07-10' },
  { id: 'e2', userId: 'u1', courseId: 'c2', enrollmentDate: '2024-07-11' },
  { id: 'e3', userId: 'u1', courseId: 'c3', enrollmentDate: '2024-07-12' },
  { id: 'e4', userId: 'u1', courseId: 'c4', enrollmentDate: '2024-07-13' },
  { id: 'e5', userId: 'u1', courseId: 'c5', enrollmentDate: '2024-07-14' },
];