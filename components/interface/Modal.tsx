import { FC, PropsWithChildren } from 'react';

import css from './Modal.module.css';

const Modal: FC<PropsWithChildren> = ({ children }) => {
  return <div className={css.modalContainer}>{children}</div>;
};

export default Modal;
