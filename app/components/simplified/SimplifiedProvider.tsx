'use client';

import { createContext, useContext, type ReactNode } from 'react';

const SimplifiedContext = createContext(false);

export function SimplifiedProvider({
  simplified,
  children,
}: {
  simplified: boolean;
  children: ReactNode;
}) {
  return (
    <SimplifiedContext.Provider value={simplified}>
      {children}
    </SimplifiedContext.Provider>
  );
}

export function useSimplified() {
  return useContext(SimplifiedContext);
}
