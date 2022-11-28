import { FC } from 'react';

import Button from './Button';
import css from './Error.module.css';

const Error: FC<{ title: string; message: string; handler: () => void }> = ({
  title,
  message,
  handler,
}) => {
  return (
    <div className={css.errorContainer}>
      <h1>{title}</h1>
      <h2>{message}</h2>
      <Button type="secondary" onClick={handler}>
        Okey
      </Button>
    </div>
  );
};

export default Error;
