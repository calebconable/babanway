'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useSimplified } from '@/app/components/simplified/SimplifiedProvider';

type Customer = {
  id: number;
  name: string;
  email: string;
};

type AuthResult = {
  success: boolean;
  message?: string;
};

type CustomerAuthContextValue = {
  customer: Customer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null);

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  }
  return context;
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const simplified = useSimplified();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (simplified) {
      setCustomer(null);
      setIsLoading(false);
      return;
    }

    const loadCustomer = async () => {
      try {
        const response = await fetch('/api/customer/auth');
        const data = (await response.json()) as { customer: Customer | null };
        setCustomer(data.customer);
      } catch {
        setCustomer(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomer();
  }, [simplified]);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (simplified) {
        return {
          success: false,
          message: 'Accounts are disabled in simplified mode.',
        };
      }

      try {
        const response = await fetch('/api/customer/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = (await response.json()) as {
          success: boolean;
          message?: string;
          customer?: Customer;
        };

        if (data.success && data.customer) {
          setCustomer(data.customer);
          return { success: true };
        }

        return { success: false, message: data.message || 'Login failed' };
      } catch {
        return { success: false, message: 'An error occurred' };
      }
    },
    [simplified]
  );

  const register = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      if (simplified) {
        return {
          success: false,
          message: 'Accounts are disabled in simplified mode.',
        };
      }

      try {
        const response = await fetch('/api/customer/auth', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = (await response.json()) as {
          success: boolean;
          message?: string;
          customer?: Customer;
        };

        if (data.success && data.customer) {
          setCustomer(data.customer);
          return { success: true };
        }

        return { success: false, message: data.message || 'Registration failed' };
      } catch {
        return { success: false, message: 'An error occurred' };
      }
    },
    [simplified]
  );

  const logout = useCallback(async () => {
    if (simplified) {
      setCustomer(null);
      return;
    }

    try {
      await fetch('/api/customer/auth', { method: 'DELETE' });
    } finally {
      setCustomer(null);
    }
  }, [simplified]);

  const value = useMemo(
    () => ({
      customer,
      isLoading,
      login,
      register,
      logout,
    }),
    [customer, isLoading, login, register, logout]
  );

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  );
}
