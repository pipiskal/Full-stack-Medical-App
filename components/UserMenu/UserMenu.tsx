import { useLanguageContext } from '@/context/LanguageProvider';
import { USER_MENU } from '@/modules/constants';
import { SelectedModalContentType } from '@/types';

import MenuItem from '../Layout/AppLayout/SideMenu/MenuItem/MenuItem';
import s from './UserMenu.module.scss';

type UserMenuPropsType = {
  onUserMenuClick: (content: SelectedModalContentType) => void;
};

const UserMenu = ({ onUserMenuClick }: UserMenuPropsType) => {
  const { translate } = useLanguageContext();

  return (
    <div className={s.wrapper}>
      <ul>
        {USER_MENU.map((item) => (
          <li key={item.displayedName}>
            <MenuItem
              text={translate(item.displayedName)}
              iconName={item.iconName}
              isDisabled={item.isDisabled}
              onClick={() =>
                onUserMenuClick(item.displayedName as SelectedModalContentType)
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserMenu;
