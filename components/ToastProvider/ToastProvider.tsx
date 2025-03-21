import { ToastContainer } from 'react-toastify';

type ToastProviderPropsType = {
  children: React.ReactNode;
};

const ToastProvider = ({ children }: ToastProviderPropsType) => {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

export default ToastProvider;
