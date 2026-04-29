import { createContext, useContext, useState, type ReactNode } from 'react';

type Page = 'login' | 'signup' | 'forgot-password' | 'verify-otp' | 'home' | 'profile' | 'notifications' | 'post-detail' | 'explore';

interface PageParams {
  userId?: number;
  tweetId?: number;
  email?: string;
  [key: string]: number | string | undefined;
}

interface RouterContextType {
  currentPage: Page;
  navigate: (page: Page, params?: PageParams) => void;
  pageParams: PageParams;
  goBack: () => void;
  previousPage: Page | null;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [pageParams, setPageParams] = useState<PageParams>({});
  const [previousPage, setPreviousPage] = useState<Page | null>(null);

  const navigate = (page: Page, params: PageParams = {}) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    setPageParams(params);
  };

  const goBack = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    }
  };

  return (
    <RouterContext.Provider value={{ currentPage, navigate, pageParams, goBack, previousPage }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within RouterProvider');
  }
  return context;
};
