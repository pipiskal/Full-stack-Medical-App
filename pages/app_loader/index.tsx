import { useRouter } from 'next/router';
import { useEffect } from 'react';

import AppLoader from '@/components/AppLoader/AppLoader';

const AppLoaderPage = (): JSX.Element | null => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  }, []);

  return <AppLoader />;
};

export default AppLoaderPage;
