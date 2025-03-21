import Button from '@/components/Button/Button';
import { useLanguageContext } from '@/context/LanguageProvider';
import s from '@/styles/pages/404.module.scss';

const NotFound = () => {
  const { translate } = useLanguageContext();

  const handleReturn = () => {
    if (window) {
      window.history.back();
    }
  };

  return (
    <div className={s.wrapper}>
      <h1>{translate('something_went_wrong')}</h1>

      <p className={s.zoom_area}>
        {translate('the_requested_page_was_not_found')}
      </p>

      <section className={s.error_container}>
        <span className={s.four}>
          <span className={s.screen_reader_text} />
        </span>

        <span className={s.zero}>
          <span className={s.screen_reader_text} />
        </span>

        <span className={s.four}>
          <span className={s.screen_reader_text} />
        </span>
      </section>

      <div className={s.link_container}>
        <Button onClick={handleReturn}>{translate('return')}</Button>
      </div>
    </div>
  );
};

export default NotFound;
