import Layout from '@/components/Layout/Layout';
import RegistrationForm from '@/components/RegistrationForm/RegistrationForm';

const RegistrationPage = (): JSX.Element => {
  return <RegistrationForm />;
};

RegistrationPage.getLayout = () => (
  <Layout type="auth">
    <RegistrationPage />
  </Layout>
);

export default RegistrationPage;
