import Layout from '@/components/Layout/Layout';
import TermsAndPrivacyBox from '@/components/TermsAndPrivacyBox/TermsAndPrivacyBox';

const TermsOfServicePage = (): JSX.Element => {
  return <TermsAndPrivacyBox type="terms" />;
};

TermsOfServicePage.getLayout = () => (
  <Layout type="auth">
    <TermsOfServicePage />
  </Layout>
);

export default TermsOfServicePage;
