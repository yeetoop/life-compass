import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyLog } from '@/lib/data';

interface LogContextType {
  logs: DailyLog[];
  addLog: (log: DailyLog) => void;
  updateLog: (date: string, log: DailyLog) => void;
  getLogByDate: (date: string) => DailyLog | undefined;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

const STORAGE_KEY = 'lifeos-logs';

export const LogProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  const addLog = (log: DailyLog) => {
    setLogs(prev => {
      const existingIndex = prev.findIndex(l => l.date === log.date);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = log;
        return updated.sort((a, b) => a.date.localeCompare(b.date));
      }
      return [...prev, log].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const updateLog = (date: string, log: DailyLog) => {
    setLogs(prev => 
      prev.map(l => l.date === date ? log : l)
    );
  };

  const getLogByDate = (date: string) => {
    return logs.find(l => l.date === date);
  };

  return (
    <LogContext.Provider value={{ logs, addLog, updateLog, getLogByDate }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
};
