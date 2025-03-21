import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useLanguageContext } from '@/context/LanguageProvider';
import { SIDE_MENU_TABS } from '@/modules/constants';
import { requestClient } from '@/modules/request';
import logo from '@/public/images/logo-color.png';

import MenuItem from './MenuItem/MenuItem';
import s from './SideMenu.module.scss';

type SideMenuPropsType = {
  isOpen: boolean;
  handleTabSelection: (tabName: string) => void;
  activeTab: string;
};

const SideMenu = ({
  isOpen,
  handleTabSelection,
  activeTab,
}: SideMenuPropsType) => {
  const router = useRouter();

  const { translate } = useLanguageContext();

  const handleLogout = async () => {
    router.replace('/');
    await requestClient('auth/logout', false, 'POST');
  };

  return (
    <div
      className={`
      ${isOpen ? s.visible_side_menu : s.hidden_side_menu}
      ${s.side_menu}
        `}
    >
      <header className={s.side_menu_header}>
        {/* header Logo */}
        <Image
          src={logo}
          width={40}
          height={40}
          alt="logo"
          className={s.logo_image}
        />
        {/* header Name */}
        <span className={s.app_title}>EnoMed</span>
        {/* subscription status Version */}
        <span className={s.subscription_status}>free trial</span>
      </header>

      <ul className={s.navigation_list}>
        {SIDE_MENU_TABS.map((section, i) => {
          return (
            <li key={i}>
              {section.sectionName && (
                <h3 className={s.section_header}>{section.sectionName}</h3>
              )}

              <ul>
                {section.menuItems.map((item, index) => {
                  return (
                    <li key={index}>
                      <MenuItem
                        text={translate(item.displayedName)}
                        iconName={item.iconName}
                        onClick={() => handleTabSelection(item.displayedName)}
                        isButtonActive={activeTab === item.displayedName}
                      />
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      <div className={s.logout_wrapper}>
        <MenuItem
          text={translate('logout')}
          iconName="logout"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default SideMenu;
