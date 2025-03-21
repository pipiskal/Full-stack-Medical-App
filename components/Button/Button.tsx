import { useRouter } from 'next/navigation';

import Loader from '../Loader/Loader';
import s from './Button.module.scss';

type ButtonPropsType = {
  children: React.ReactNode;
  type?: 'submit' | 'button';
  variant?: 'primary' | 'secondary';
  navigateTo?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  navigateTo,
  isDisabled = false,
  isLoading = false,
  onClick,
}: ButtonPropsType) => {
  const router = useRouter();

  return (
    <button
      type={type}
      onClick={navigateTo ? () => router.push(navigateTo || '') : onClick}
      className={s[variant]}
      disabled={isDisabled}
    >
      {isLoading ? (
        <Loader type={variant === 'primary' ? 'default' : 'colorful'} />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
