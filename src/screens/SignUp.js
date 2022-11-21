import { gql, useMutation } from "@apollo/client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AuthLayout from "../components/auth/AuthLayout";
import Button from "../components/auth/Button";
import FormBox from "../components/auth/FormBox";
import FormError from "../components/auth/FormError";
import Input from "../components/auth/Input";
import PageTitle from "../components/PageTitle";
import { FatLink } from "../components/shared";
import { HOME_PATH } from "./Home";

export const SIGN_UP_PATH = "/sign-up";

const CREATE_ACCOUNT_MUTATAION = gql`
  mutation createAccount(
    $firstName: String!
    $lastName: String
    $email: String!
    $username: String!
    $password: String!
  ) {
    createAccount(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
    ) {
      ok
      error
      user {
        id
      }
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Subtitle = styled(FatLink)`
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;
const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState,
    setError,
    getValues,
    clearErrors,
  } = useForm({
    mode: "onChange",
  });
  const onCompleted = (data) => {
    const {
      createAccount: { ok, error, user },
    } = data;

    if (ok) {
      const { username, password } = getValues();
      navigate(HOME_PATH, {
        state: {
          message: "Account Created, Please Login.",
          username,
          password,
        },
      });
    }

    if (error) {
      return setError("result", {
        message: error,
      });
    }
  };
  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATAION, {
    onCompleted,
  });

  const onValid = (data) => {
    if (!loading) {
      createAccount({
        variables: {
          ...data,
        },
      });
    }
  };

  const signUpClearErrors = () => {
    clearErrors("result");
  };
  return (
    <AuthLayout>
      <PageTitle title="Sign up" />
      <FormBox>
        <HeaderContainer>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
          <Subtitle>友達に写真と動画を見るために登録する</Subtitle>
        </HeaderContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <Input
            {...register("firstName", {
              required: {
                message: "性は必要です",
              },
            })}
            type="text"
            placeholder="性"
          />
          <FormError message={formState.errors?.firstName?.message} />
          <Input
            {...register("lastName", {
              minLength: {
                message: "名は5個以上でしてください",
                value: 5,
              },
            })}
            type="text"
            placeholder="名"
          />
          <FormError message={formState.errors?.lastName?.message} />
          <Input
            {...register("username", {
              required: {
                message: "名前は必要です",
              },
              minLength: {
                message: "名前は5個以上でしてください",
                value: 5,
              },
            })}
            type="text"
            onFocus={signUpClearErrors}
            placeholder="名前"
          />
          <FormError message={formState.errors?.username?.message} />
          <Input
            {...register("email", {
              required: {
                message: "メールは必要です",
              },
              minLength: {
                message: "メールは5個以上でしてください",
                value: 5,
              },
            })}
            type="text"
            onFocus={signUpClearErrors}
            placeholder="メール"
          />
          <FormError message={formState.errors?.email?.message} />
          <Input
            {...register("password", {
              required: {
                message: "パスワードは必要です",
              },
              minLength: {
                message: "パスワードは5個以上でしてください",
                value: 5,
              },
            })}
            type="password"
            placeholder="パスワード"
          />
          <FormError message={formState.errors?.password?.message} />
          <Button
            disabled={!formState.isValid || loading}
            type="submit"
            value={loading ? "ローディング中" : "登録する"}
          />
          <FormError message={formState.errors?.result?.message} />
        </form>
      </FormBox>
    </AuthLayout>
  );
};
export default SignUp;
