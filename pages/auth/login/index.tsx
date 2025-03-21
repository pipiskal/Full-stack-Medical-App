import Layout from '@/components/Layout/Layout';
import LoginForm from '@/components/LoginForm/LoginForm';

const LoginPage = (): JSX.Element => {
  return <LoginForm />;
};

LoginPage.getLayout = () => (
  <Layout type="auth">
    <LoginPage />
  </Layout>
);

export default LoginPage;
