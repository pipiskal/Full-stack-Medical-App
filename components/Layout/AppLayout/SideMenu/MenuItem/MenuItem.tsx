import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { iconSelector } from '@/modules/componentSelectors';

import s from './MenuItem.module.scss';

type MenuItemPropsType = {
  text: string;
  path?: string;
  iconName: string;
  isDisabled?: boolean;
  isButtonActive?: boolean;
  onClick?: () => void;
};

const MenuItem = ({
  text,
  path = '',
  iconName,
  isDisabled = false,
  onClick,
  isButtonActive = false,
}: MenuItemPropsType) => {
  const pathname = usePathname();

  const activePath = pathname?.split('/')[2];
  const isActive = path ? activePath === path : isButtonActive;
  const redirectedPath = path === '' ? '' : `/${path}`;

  return onClick ? (
    <button
      onClick={onClick}
      className={`${isActive && s.active_item_menu}  ${s.item_menu}`}
      disabled={isDisabled}
    >
      <span className={s.item_menu_icon}>{iconSelector[iconName]}</span>
      {text}
    </button>
  ) : (
    <Link
      // TODO : Removed / after dashboard to fix the issue with the active menu item
      href={`/dashboard${redirectedPath}`}
      className={`${isActive && s.active_item_menu}  ${s.item_menu}`}
    >
      <div className={s.item_menu_icon}>{iconSelector[iconName]}</div>
      {text}
    </Link>
  );
};

export default MenuItem;
