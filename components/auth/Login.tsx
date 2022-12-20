import { signIn } from "next-auth/react";
import { RiGoogleFill, RiSpyLine } from "react-icons/ri";

import Button from "../interface/Button";
import css from "./Login.module.css";

const Login = () => {
  return (
    <div className={css.loginContainer}>
      <h1>
        Would you like to receive notifications whenever a new episode of your
        favourite anime comes out?
      </h1>
      <h1>This app will ensure that you are up to date.</h1>

      <Button
        icon={<RiGoogleFill />}
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Login with Google
      </Button>
      <Button
        type="secondary"
        icon={<RiSpyLine />}
        onClick={() => signIn("preview", { callbackUrl: "/" })}
      >
        Preview
      </Button>
    </div>
  );
};

export default Login;
