export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface Candidate {
    _id: string;
    name: string;
    email: string;
    phoneNumber: string;
    jobTitle: string;
    status: 'Pending' | 'Reviewed' | 'Hired';
    resumeUrl?: string;
    createdAt: string;
    referredBy: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }