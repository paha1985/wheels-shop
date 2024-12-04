import { styled } from "styled-components";
import { Icon } from "../../../icon/icon";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_TYPE, CLOSE_MODAL, openModal } from "../../../../actions";
import { selectUserLogin } from "../../../../selectors/select-user-login";
import { logout } from "../../../../actions/logout";
import { useEffect, useState } from "react";
import { setUser } from "../../../../actions/set-user";
import { ROLE } from "../../../../constants";
import { Link } from "react-router-dom";

const AppContentHeaderContainer = ({ className, title }) => {
  const login = useSelector(selectUserLogin);

  const dispatch = useDispatch();

  const openModals = () => {
    dispatch(
      openModal({
        authorization: true,
      })
    );
  };

  const signout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("staff_id");
    dispatch(logout());
  };

  const changeTheme = () => {
    const light = localStorage.getItem("light");
    const html = document.querySelector("html");
    if (light) {
      localStorage.removeItem("light");
      html.classList.remove("light");
    } else {
      localStorage.setItem("light", "light");
      html.classList.add("light");
    }
  };

  return (
    <div className={className}>
      <h1>{title}</h1>
      <div className="icons">
        <button className="basket">
          <Icon id="fa-phone" size="19px" />
          <div style={{ paddingLeft: "10px" }}>8-800-888888</div>
        </button>

        {login ? (
          <div className="basket">
            <Icon id="fa-user-o" size="19px" />
            <div style={{ paddingLeft: "10px" }}> {login}</div>
            <Icon
              style={{ margin: "2px 0 0 5px" }}
              id="fa-sign-out"
              size="19px"
              onClick={() => signout()}
            />
          </div>
        ) : (
          <button className="basket" onClick={() => openModals()}>
            <Icon id="fa-user-o" size="19px" />
            <div style={{ paddingLeft: "10px" }}>Войти</div>
          </button>
        )}

        {login && (
          <Link to={`/orders`} className="basket">
            <Icon id="fa-credit-card" size="19px" />
            <div style={{ paddingLeft: "10px" }}>Мои заказы</div>
          </Link>
        )}

        {login && (
          <Link to={`/basket`} className="basket">
            <Icon id="fa-shopping-cart" size="19px" />
            <div style={{ paddingLeft: "10px" }}>Корзина</div>
          </Link>
        )}
        <button className="mode-switch">
          <Icon id="fa-sun-o" size="19px" onClick={() => changeTheme()} />
        </button>
      </div>
    </div>
  );
};

export const AppContentHeader = styled(AppContentHeaderContainer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  & h1 {
    color: var(--app-content-main-color);
    font-size: var(--font-large);
    line-height: 32px;
    margin: 0;
  }

& .mode-switch, .basket{
    background-color: transparent;
    border: none;
    padding: 0;
    color: var(--app-content-main-color);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: 8px;
    cursor: pointer;
}

.basket {
padding-right: 20px}

& .icons{
  display:flex;
}

& a {
    text-decoration: none;
    color: var(--app-content-main-color);
}

}

`;
