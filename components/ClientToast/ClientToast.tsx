'use-client';
import { toastMessage } from '@/modules/helpers';
import { TranslationsType } from '@/types';

const ClientToast = async ({
  translations,
}: {
  translations: TranslationsType;
}) => {
  toastMessage(translations['invalid_login_credentials'], 'error');
  return <></>;
};

export default ClientToast;
