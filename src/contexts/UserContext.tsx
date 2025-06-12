
import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'maker' | 'checker' | 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  geographyId?: string;
  categoryId?: string;
}

interface UserContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'John Admin',
    email: 'admin@company.com',
    phone: '+1234567890',
    role: 'admin',
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@company.com',
      phone: '+1234567890',
      role: 'admin',
    },
    {
      id: '2',
      name: 'Jane Maker',
      email: 'maker@company.com',
      phone: '+1234567891',
      role: 'maker',
    },
    {
      id: '3',
      name: 'Bob Checker',
      email: 'checker@company.com',
      phone: '+1234567892',
      role: 'checker',
    },
  ]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};
