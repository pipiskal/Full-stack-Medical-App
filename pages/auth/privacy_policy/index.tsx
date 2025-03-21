import Layout from '@/components/Layout/Layout';
import TermsAndPrivacyBox from '@/components/TermsAndPrivacyBox/TermsAndPrivacyBox';

const PrivacyPolicyPage = (): JSX.Element => {
  return <TermsAndPrivacyBox type="privacy" />;
};

PrivacyPolicyPage.getLayout = () => (
  <Layout type="auth">
    <PrivacyPolicyPage />
  </Layout>
);

export default PrivacyPolicyPage;
