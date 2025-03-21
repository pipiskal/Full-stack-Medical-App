import Button from '@/components/Button/Button';
import Layout from '@/components/Layout/Layout';
import { useLanguageContext } from '@/context/LanguageProvider';
import s from '@/styles/pages/welcome.module.scss';

const WelcomePage = (): JSX.Element => {
  const { translate } = useLanguageContext();

  return (
    <div className={s.form_wrapper}>
      <div className={s.wrapper}>
        <h2 className={s.title}>{translate('welcome')}</h2>

        <p className={s.description}>{translate('welcome_free_trial_text')}</p>

        <Button navigateTo="/dashboard">{translate('start')}</Button>
      </div>
    </div>
  );
};

WelcomePage.getLayout = () => (
  <Layout type="auth">
    <WelcomePage />
  </Layout>
);

export default WelcomePage;
