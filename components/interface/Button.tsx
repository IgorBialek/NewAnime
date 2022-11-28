import { FC, PropsWithChildren, ReactElement } from 'react';

import css from './Button.module.css';

const Button: FC<
  PropsWithChildren<{
    icon?: ReactElement;
    onClick?: () => void;
    type?: string;
  }>
> = ({ children, icon, onClick, type }) => {
  return (
    <div
      className={`${css.buttonContainer} ${css[type ?? "primary"]}`}
      onClick={onClick}
    >
      {icon}
      {children}
    </div>
  );
};

export default Button;
