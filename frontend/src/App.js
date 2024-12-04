import styled from "styled-components";
import { AppContent, Sidebar } from "./components";
import { Routes, Route } from "react-router-dom";
import { Authorization, Basket, Brands, Marks, Products } from "./pages";
import { About } from "./pages/about/about";
import { Modal } from "./components/modal/modal";
import { useEffect, useState } from "react";
import { check } from "./http/userAPI";
import { setUser } from "./actions/set-user";
import { useDispatch, useSelector } from "react-redux";
import { ModalChildren } from "./components/modal-children-form/modal-children-form";
import { Loader } from "./components/loader/loader";
import { selectCategoryName } from "./selectors/select-category-name";
import { Categories } from "./pages/categories/categories";
import { Properties } from "./pages/properties/properties";
import { Users } from "./pages/users/users";
import { Orders } from "./pages/orders/orders";

const AppContainer = ({ className }) => {
  const dispatch = useDispatch();
  const loading = useSelector(({ app }) => app.isLoading);

  useEffect(() => {
    const loader = document.querySelector(".loader");
    loading ? loader.classList.remove("hide") : loader.classList.add("hide");
  }, [loading]);

  useEffect(() => {
    check()
      .then((data) => {
        localStorage.setItem("user_id", data.id);
        dispatch(
          setUser({
            id: data.id,
            login: data.login,
            staffId: data.role,
          })
        );
      })
      .catch((e) => console.log(e));
  }, [dispatch]);

  const categoryName = useSelector(selectCategoryName);

  const [search, setSearch] = useState("");

  return (
    <div className={className}>
      <Loader />
      <Modal />
      <ModalChildren />
      <Sidebar />
      <Routes>
        <Route
          path="/"
          element={
            <AppContent title="Главная" viewSearch={true}>
              <Products />
            </AppContent>
          }
        />
        <Route
          path="/products"
          element={
            <AppContent
              viewSearch={true}
              title={categoryName ? categoryName : "Все товары"}
              search={search}
              setSearch={setSearch}
            >
              <Products search={search} setSearch={setSearch} />
            </AppContent>
          }
        />
        <Route
          path="/basket"
          element={
            <AppContent title="Корзина" viewSearch={false}>
              <Basket />
            </AppContent>
          }
        />
        <Route
          path="/about"
          element={
            <AppContent title="О компании" viewSearch={false}>
              <About />
            </AppContent>
          }
        />
        <Route
          path="/authorization"
          element={
            <AppContent title="Авторизация" viewSearch={false}>
              <Authorization />
            </AppContent>
          }
        />
        <Route
          path="/categories"
          element={
            <AppContent title="Категории" viewSearch={false}>
              <Categories />
            </AppContent>
          }
        />
        <Route
          path="/brands"
          element={
            <AppContent title="Бренды" viewSearch={false}>
              <Brands />
            </AppContent>
          }
        />
        <Route
          path="/marks"
          element={
            <AppContent title="Марки" viewSearch={false}>
              <Marks />
            </AppContent>
          }
        />
        <Route
          path="/properties"
          element={
            <AppContent title="Свойства товаров" viewSearch={false}>
              <Properties />
            </AppContent>
          }
        />
        <Route
          path="/users"
          element={
            <AppContent title="Пользователи" viewSearch={false}>
              <Users />
            </AppContent>
          }
        />
        <Route
          path="/orders"
          element={
            <AppContent title="Заказы" viewSearch={false}>
              <Orders />
            </AppContent>
          }
        />
      </Routes>
    </div>
  );
};

export const App = styled(AppContainer)`
  border-radius: 4px;
  width: 100%;
  height: 100%;
  max-height: 100%;
  max-width: 1280px;
  display: flex;
  overflow: hidden;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  max-width: 2000px;
  margin: 0 auto;
`;
