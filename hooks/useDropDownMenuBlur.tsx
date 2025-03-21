import { useEffect, useRef } from 'react';

type UseElementBlurProps = {
  handleMenuClose: () => void;
};

const useDropDownMenuBlur = ({ handleMenuClose }: UseElementBlurProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const closeDropdownOnOutsideClick = (event: MouseEvent) => {
    if (
      elementRef.current &&
      !elementRef.current.contains(event.target as Node)
    ) {
      handleMenuClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdownOnOutsideClick);

    return () => {
      document.removeEventListener('click', closeDropdownOnOutsideClick);
    };
  }, []);

  return {
    elementRef,
  };
};

export default useDropDownMenuBlur;
