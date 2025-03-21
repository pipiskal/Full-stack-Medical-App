import React, { useState } from 'react';

import { useLanguageContext } from '@/context/LanguageProvider';

import s from './Tabs.module.scss';

type TabsPropsType = {
  selector: Record<string, React.ReactNode>;
};

const Tabs = ({ selector }: TabsPropsType) => {
  const { translate } = useLanguageContext();
  // get keys from selector
  const keys = Object.keys(selector);
  const [activeTab, setActiveTab] = useState<string>(keys[0]);

  return (
    <div className={s.tabs_wrapper}>
      <div className={s.buttons_wrapper}>
        {keys.map((tabData) => (
          <button
            key={tabData}
            className={`${s.button} ${activeTab === tabData && s.active}`}
            onClick={() => setActiveTab(tabData)}
          >
            {translate(tabData)}
          </button>
        ))}
      </div>

      <div className={s.content}>{selector[activeTab]}</div>
    </div>
  );
};

export default Tabs;
