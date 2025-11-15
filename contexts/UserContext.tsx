import { AuthUser } from '@/api/types';
import { createContext, useContext, useMemo, useState } from 'react';

export type User = Pick<
  AuthUser,
  'id' | 'name' | 'email' | 'phoneNo' | 'createdAt' | 'updatedAt' | 'profilePhotoUrl'
>;

type UserContextValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  syncUser: (apiUser: AuthUser | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

const mapApiUserToStore = (apiUser: AuthUser): User => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  phoneNo: apiUser.phoneNo,
  createdAt: apiUser.createdAt,
  updatedAt: apiUser.updatedAt,
  profilePhotoUrl: apiUser.profilePhotoUrl,
});

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUserState] = useState<User | null>(null);

  const value = useMemo(
    () => ({
      user,
      setUser: setUserState,
      clearUser: () => setUserState(null),
      syncUser: (apiUser: AuthUser | null) =>
        setUserState(apiUser ? mapApiUserToStore(apiUser) : null),
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const userUtils = {
  mapApiUserToStore,
};

