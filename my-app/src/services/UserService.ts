// src/services/UserService.ts

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  initials: string;
  email: string;
  avatar?: string;
}

const mockUser: UserProfile = {
  id: 'u1',
  firstName: 'Siddhartha',
  lastName: 'Test',
  fullName: 'Siddhartha Test',
  initials: 'ST',
  email: 'siddhartha@yopips.com',
};

export class UserService {
  static async getCurrentUser(): Promise<UserProfile> {
    return new Promise(r => setTimeout(() => r(mockUser), 100));
  }
}
