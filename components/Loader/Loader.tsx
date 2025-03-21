import s from './Loader.module.scss';

type LoaderPropsType = {
  type?: 'default' | 'colorful';
};

const Loader = ({ type = 'default' }: LoaderPropsType) => {
  return (
    <div className={s.loader}>
      <div
        className={`${s[type === 'colorful' ? 'colored' : 'default_color']} ${
          s.dot
        }`}
      ></div>
      <div
        className={`${s[type === 'colorful' ? 'colored' : 'default_color']} ${
          s.dot
        }`}
      ></div>
      <div
        className={`${s[type === 'colorful' ? 'colored' : 'default_color']} ${
          s.dot
        }`}
      ></div>
    </div>
  );
};

export default Loader;
