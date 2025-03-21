import ForgotPasswordForm from '@/components/ForgotPasswordForm/ForgotPasswordForm';
import Layout from '@/components/Layout/Layout';

const ForgotPasswordPage = (): JSX.Element => {
  return <ForgotPasswordForm />;
};

ForgotPasswordPage.getLayout = () => (
  <Layout type="auth">
    <ForgotPasswordPage />
  </Layout>
);

export default ForgotPasswordPage;
