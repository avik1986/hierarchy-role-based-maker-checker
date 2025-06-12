
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'maker' | 'checker' | 'viewer';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserContextType {
  currentUser: User;
  users: User[];
  setUsers: (users: User[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser] = useState<User>({
    id: '1',
    name: 'John Admin',
    email: 'admin@company.com',
    role: 'admin'
  });

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Admin', email: 'admin@company.com', role: 'admin' },
    { id: '2', name: 'Jane Maker', email: 'maker@company.com', role: 'maker' },
    { id: '3', name: 'Bob Checker', email: 'checker@company.com', role: 'checker' },
    { id: '4', name: 'Alice Viewer', email: 'viewer@company.com', role: 'viewer' },
  ]);

  return (
    <UserContext.Provider value={{ currentUser, users, setUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
