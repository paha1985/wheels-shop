import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import styled from "styled-components";
import { Input, AuthFormError } from "../../components";
import { Navigate } from "react-router-dom";
// import { setUser } from "../../actions";
import { useDispatch, useSelector } from "react-redux";
// import { selectUserRole } from "../../selectors";
// import { ROLE } from "../../constants";
import { useResetForm } from "../../hooks";
import { CLOSE_MODAL } from "../../actions";
import { registration } from "../../http/userAPI";
import { ROLE } from "../../constants";
import { setUser } from "../../actions/set-user";

const regFormSchema = yup.object().shape({
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
  passcheck: yup
    .string()
    .required("Заполните проверку пароля")
    .oneOf([yup.ref("password"), null], "Повтор пароля не свпадает"),
});

const RegistrationContainer = ({ className }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      login: "",
      password: "",
      passcheck: "",
    },
    resolver: yupResolver(regFormSchema),
  });

  const [serverError, setServerError] = useState();
  const dispatch = useDispatch();

  useResetForm(reset);

  const onSubmit = async ({ login, password }) => {
    try {
      const response = await registration(login, password, ROLE.USER);
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
      setServerError(`Ошибка запроса: ${e.message}`);
    }

    // server.register(login, password).then(({ error, res }) => {
    // 	if (error) {
    // 		setServerError(`Ошибка запроса: ${error}`);
    // 	}
    // 	dispatch(setUser(res));
    // 	sessionStorage.setItem('userData', JSON.stringify(res));
    // });
  };

  const formError =
    errors?.login?.message ||
    errors?.password?.message ||
    errors?.passcheck?.message;
  const errorMessage = formError || serverError;

  // if (roleId !== ROLE.GUEST) {
  //   return <Navigate to="/" />;
  // }

  return (
    <div className={className}>
      <h2>Регистрация</h2>
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
        <Input
          type="password"
          placeholder="Проверка пароля..."
          {...register("passcheck", { onChange: () => setServerError(null) })}
        />
        <div className="buttons">
          <button type="submit" disabled={!!formError}>
            Зарегистрироваться
          </button>
          <button
            style={{ width: "120px" }}
            onClick={() => dispatch(CLOSE_MODAL)}
          >
            Отмена
          </button>
        </div>
        {errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
      </form>
    </div>
  );
};

export const Registration = styled(RegistrationContainer)`
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
  & a {
    color: var(--app-content-main-color);
    text-decoration: none;
  }
  & button {
    height: 35px;
    color: var(--app-content-main-color);
    border: 2px solid var(--app-content-main-color);
    background: var(--filter-reset);
    width: 145px;
  }
`;
