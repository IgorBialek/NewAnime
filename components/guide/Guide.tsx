import { FC } from 'react';

import Button from '../interface/Button';
import css from './Guide.module.css';

const Guide: FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <div className={css.guideContainer}>
      <h1>How to get messenger id?</h1>
      <p>
        You need to write to{" "}
        <a href="https://www.facebook.com/profile.php?id=100088096069884">
          this
        </a>{" "}
        Facebook page message, to receive your id. Copy it and set it in the
        app. After this whenever a new episode of anime came up you will get
        notified over messenger.
      </p>
      <Button className={css.button} type="secondary" onClick={onClick}>
        Okey
      </Button>
    </div>
  );
};

export default Guide;
