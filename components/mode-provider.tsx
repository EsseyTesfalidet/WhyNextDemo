'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type ModeContextType = {
  isOptimized: boolean;
  setOptimized: (value: boolean) => void;
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({
  initialOptimized,
  children
}: {
  initialOptimized: boolean;
  children: React.ReactNode;
}) {
  const [isOptimized, setIsOptimized] = useState(initialOptimized);

  const value = useMemo(
    () => ({
      isOptimized,
      setOptimized: setIsOptimized
    }),
    [isOptimized]
  );

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within ModeProvider');
  }
  return context;
}
