import { User } from '../types';

const STORAGE_KEY_CURRENT_USER = 'ondo_current_user';

const readUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
};

const writeUser = (user: User | null) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    return;
  }
  localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => readUser();

export const signInWithEmail = async (email: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const user: User = {
    id: `u_${Date.now()}`,
    email,
    nickname: ''
  };
  writeUser(user);
  return user;
};

export const updateNickname = async (nickname: string): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const user = readUser();
  if (!user) return null;
  const updated = { ...user, nickname };
  writeUser(updated);
  return updated;
};

export const signOut = () => {
  writeUser(null);
};
