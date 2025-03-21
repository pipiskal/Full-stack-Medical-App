import Button from '@/components/Button/Button';
import { useLanguageContext } from '@/context/LanguageProvider';
import s from '@/styles/pages/500.module.scss';

const ServerError = () => {
  const { translate } = useLanguageContext();

  const handleMailOpen = () => {
    if (window) {
      window.open('mailto:enospacedev@gmail.com?subject=500 Error');
    }
  };

  return (
    <div className={s.container}>
      <div>
        <p className={s.smile_face}>:(</p>
        <p className={s.code}>500</p>
        <p className={s.text}>{translate('500_error')}</p>

        <div className={s.buttons_wrapper}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (window) {
                window.location.reload();
              }
            }}
          >
            {translate('refresh')}
          </Button>

          <span>&nbsp;|&nbsp;</span>

          <Button type="button" variant="secondary" onClick={handleMailOpen}>
            {translate('contact_support')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
