import { FC, PropsWithChildren, ReactElement } from 'react';

import css from './Button.module.css';

const Button: FC<
  PropsWithChildren<{
    icon?: ReactElement;
    onClick?: () => void;
    type?: string;
    className?: string;
  }>
> = ({ children, icon, onClick, type, className }) => {
  return (
    <div
      className={`${css.buttonContainer} ${className} ${
        css[type ?? "primary"]
      }`}
      onClick={onClick}
    >
      {icon}
      {children}
    </div>
  );
};

export default Button;
