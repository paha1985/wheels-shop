import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import { server } from '../../bff';
import { useState } from "react";
import styled from "styled-components";
import { useResetForm } from "../../hooks";
import { Input, AuthFormError } from "../../components";
import { Link, Navigate } from "react-router-dom";
// import { setUser } from '../../actions';
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_MODAL, openModal } from "../../actions";
import { setUser } from "../../actions/set-user";
import { signIn } from "../../http/userAPI";
// import { selectUserRole } from '../../selectors';
// import { ROLE } from '../../constants';

const authFormSchema = yup.object().shape({
  login: yup
    .string()
    .required("Заполните логин")
    .matches(/^\w+$/, "Неверный логин. Допускаются только буквы и цифры")
    .min(3, "Неверный логин. Минимум 3 символа")
    .max(15, "Неверный логин. Максимум 15 символов"),
  password: yup
    .string()
    .required("Заполните пароль")
    .matches(
      /^[\w#%]+$/,
      "Неверно заполнен пароль. Допускаются буквы, цифры и знаки № %"
    )
    .min(6, "Неверно заполнен пароль. Минимум 6 символа")
    .max(20, "Неверно заполнен пароль. Максимум 20 символов"),
});

const StyledLink = styled(Link)`
  text-align: center;
  text-decoration: underline;
  margin: 20px 0;
  font-size: 18px;
`;

const AuthorizationContainer = ({ className }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
    },
    resolver: yupResolver(authFormSchema),
  });

  const [serverError, setServerError] = useState();
  const dispatch = useDispatch();

  //   const roleId = useSelector(selectUserRole);

  useResetForm(reset);

  const onSubmit = async ({ login, password }) => {
    try {
      const response = await signIn(login, password);
      dispatch(
        setUser({
          id: response.id,
          login: response.login,
          staffId: response.role,
        })
      );
      localStorage.setItem("user_id", response.id);
      localStorage.setItem("staff_id", response.role);
      dispatch(CLOSE_MODAL);
    } catch (e) {
      setServerError(`${e.response.data.message}`);
    }
    // server.authotize(login, password).then(({ error, res }) => {
    //   if (error) {
    //     setServerError(`Ошибка запроса: ${error}`);
    //   }
    //   dispatch(setUser(res));
    //   sessionStorage.setItem("userData", JSON.stringify(res));
    // });
  };

  const CancelAuth = () => {
    dispatch(CLOSE_MODAL);
  };

  const formError = errors?.login?.message || errors?.password?.message;
  const errorMessage = formError || serverError;

  //   if (roleId !== ROLE.GUEST) {
  //     return <Navigate to="/" />;
  //   }

  const goToRegister = () => {
    dispatch(CLOSE_MODAL);
    dispatch(
      openModal({
        registration: true,
      })
    );
  };

  return (
    <div className={className}>
      <h2>Авторизация</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          placeholder="Логин..."
          {...register("login", { onChange: () => setServerError(null) })}
        />
        <Input
          type="password"
          placeholder="Пароль..."
          {...register("password", { onChange: () => setServerError(null) })}
        />
        <div className="buttons">
          <button
            style={{ width: "120px" }}
            type="submit"
            disabled={!!formError}
          >
            Авторизоваться
          </button>
          <button style={{ width: "120px" }} onClick={() => CancelAuth()}>
            Отмена
          </button>
        </div>

        {errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
        {/* <StyledLink to="/register">Регистрация</StyledLink> */}
        <div
          className="register"
          onClick={() => {
            goToRegister();
          }}
        >
          Регистрация
        </div>
      </form>
    </div>
  );
};

export const Authorization = styled(AuthorizationContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--app-bg);
  color: var(--app-content-main-color);
  & > form {
    display: flex;
    flex-direction: column;
    width: 260px;
  }
  & input {
    margin-bottom: 15px;
  }
  & .register {
    color: var(--app-content-main-color);
    text-decoration: none;
    cursor: pointer;
    margin-top: 15px;
  }
  & button {
    height: 35px;
    color: var(--app-content-main-color);
    border: 2px solid var(--app-content-main-color);
    background: var(--app-content-secondary-color);
  }
`;
