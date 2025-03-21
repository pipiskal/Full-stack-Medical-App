import 'react-toastify/dist/ReactToastify.css';

import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import LanguageSelector from '@/components/LanguageSelector/LanguageSelector';

import s from './AuthLayout.module.scss';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Image
          src="/images/logo-color.png"
          width={30}
          height={30}
          alt="logo"
          rel="preload"
          priority
          onClick={() => router.push('/')}
        />

        <LanguageSelector />
      </div>

      <Image
        src="/images/logo.png"
        width={1100}
        height={800}
        alt="logo"
        className={s.logo_image}
        rel="preload"
        priority
      />

      <div className={s.main}>
        <div className={s.children_wrapper}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
