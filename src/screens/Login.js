import { isLoggedInVar, userLogIn } from "../apollo";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { SIGN_UP_PATH } from "./SignUp";
import AuthLayout from "../components/auth/AuthLayout";
import FormBox from "../components/auth/FormBox";
import Input from "../components/auth/Input";
import Button from "../components/auth/Button";
import Separator from "../components/auth/Separator";
import BottomBox from "../components/auth/BottomBox";
import PageTitle from "../components/PageTitle";
import { useForm } from "react-hook-form";
import FormError from "../components/auth/FormError";
import { gql, useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom";

export const LOGIN_PATH = "/login";
const FacebookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-weight: 600;
  }
`;
const Notification = styled.div`
  margin-top: 10px;
  margin-bottom: -15px;
  color: #2ecc71;
`;
const LOGIN_MUTATAION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;
const Login = () => {
  const location = useLocation();

  const { register, handleSubmit, formState, clearErrors, setError } = useForm({
    mode: "onChange",
    defaultValues: {
      username: location.state?.username,
      password: location.state?.password,
    },
  });

  const onCompleted = (data) => {
    const {
      login: { ok, token, error },
    } = data;

    if (!ok) {
      setError("result", {
        message: error,
      });
    }
    if (token) {
      userLogIn(token);
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATAION, {
    onCompleted,
  });

  const onValid = (data) => {
    if (!loading) {
      const { username, password } = data;
      login({
        variables: { username, password },
      });
    }
  };

  const clearLoginError = () => {
    clearErrors("result");
  };
  return (
    <AuthLayout>
      <PageTitle title="Login" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification>{location?.state?.message}</Notification>
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("username", {
              required: {
                message: "ユーザー名前は必要です",
              },
              minLength: {
                value: 5,
                message: "ユーザー名前は5個以上でしてください",
              },
            })}
            onFocus={clearLoginError}
            type="text"
            placeholder="電話番号、ユーザー名前及びメール"
            hasError={Boolean(formState.errors?.username?.message)}
          />
          <FormError message={formState.errors?.username?.message} />
          <Input
            {...register("password", {
              required: {
                message: "パスワードは必要です",
              },
              minLength: {
                value: 5,
                message: "パスワードは5個以上でしてください",
              },
            })}
            onFocus={clearLoginError}
            type="password"
            placeholder="パスポート"
            hasError={Boolean(formState.errors?.password?.message)}
          />
          <FormError message={formState.errors?.password?.message} />
          <Button
            type={"submit"}
            disabled={!formState.isValid || loading}
            value={loading ? "ローディング中" : "ログイン"}
          />
          <FormError message={formState.errors?.result?.message} />
        </form>
        <Separator />
        <FacebookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>フェイスブックでログイン</span>
        </FacebookLogin>
      </FormBox>
      <BottomBox
        cta="アカウントがありませんか"
        linkText="登録する"
        link={SIGN_UP_PATH}
      />
    </AuthLayout>
  );
};
export default Login;
