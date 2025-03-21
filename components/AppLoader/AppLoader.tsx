import { useLanguageContext } from '@/context/LanguageProvider';

import s from './AppLoader.module.scss';

const AppLoader = () => {
  const { translate } = useLanguageContext();

  return (
    <div className={s.wrapper}>
      <h3 className={s.title}>
        <span>E</span>
        no
        <span>M</span>
        ed
      </h3>
      <p className={s.loading_text}>{`${translate('loading')}...`}</p>
    </div>
  );
};

export default AppLoader;
