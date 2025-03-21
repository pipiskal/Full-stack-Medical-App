import Layout from '@/components/Layout/Layout';
import ResetPasswordForm from '@/components/ResetPasswordForm/ResetPasswordForm';

const ForgotPasswordPage = (): JSX.Element => {
  return <ResetPasswordForm />;
};

ForgotPasswordPage.getLayout = () => (
  <Layout type="auth">
    <ForgotPasswordPage />
  </Layout>
);

export default ForgotPasswordPage;
