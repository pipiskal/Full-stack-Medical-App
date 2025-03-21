import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Image from 'next/image';

import UserMenu from '@/components/UserMenu/UserMenu';
import { dataContext } from '@/context/DataProvider';
import useDropDownMenuBlur from '@/hooks/useDropDownMenuBlur';
import USER_ICON from '@/public/images/user_default.png';
import { SelectedModalContentType } from '@/types';

import s from './Header.module.scss';

type LayoutHeaderPropsType = {
  isLayoutVisible: boolean;
  isUserMenuVisible: boolean;
  setIsUserMenuVisible: (value: boolean) => void;
  onSearch?: (searchTerm: string) => void;
  onChangeLayoutVisibility?: () => void;
  onChangeUserMenuVisibility?: () => void;
  onUserMenuClick: (content: SelectedModalContentType) => void;
};

const Header = ({
  isLayoutVisible,
  isUserMenuVisible,
  setIsUserMenuVisible,
  onChangeLayoutVisibility,
  onChangeUserMenuVisibility,
  onUserMenuClick,
}: LayoutHeaderPropsType) => {
  const { user } = dataContext();

  const { elementRef: userMenuRef } = useDropDownMenuBlur({
    handleMenuClose: () => setIsUserMenuVisible(false),
  });

  return (
    user && (
      <div
        className={` ${isLayoutVisible && s.layout_header_side_menu_open}
        ${s.layout_header}
          `}
      >
        <div className={s.section}>
          <button onClick={onChangeLayoutVisibility} className={s.button}>
            {isLayoutVisible ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>
        </div>

        <div className={s.section} ref={userMenuRef}>
          <button
            className={s.settings_button}
            onClick={onChangeUserMenuVisibility}
          >
            <Image src={USER_ICON} width={32} height={32} alt="user" />
            <p>{user.firstName}</p>
          </button>

          {isUserMenuVisible && <UserMenu onUserMenuClick={onUserMenuClick} />}
        </div>
      </div>
    )
  );
};

export default Header;
