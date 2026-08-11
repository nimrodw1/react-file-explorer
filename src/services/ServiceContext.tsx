import { createContext, useContext, type ReactNode } from 'react';
import type { IFileSystemService } from './IFileSystemService';
import { MockFileSystemService } from './mock/MockFileSystemService';

const defaultService = new MockFileSystemService();

const ServiceContext = createContext<IFileSystemService>(defaultService);

interface ServiceProviderProps {
  service?: IFileSystemService;
  children: ReactNode;
}

export function ServiceProvider({ service = defaultService, children }: ServiceProviderProps) {
  return <ServiceContext.Provider value={service}>{children}</ServiceContext.Provider>;
}

export function useService(): IFileSystemService {
  return useContext(ServiceContext);
}
