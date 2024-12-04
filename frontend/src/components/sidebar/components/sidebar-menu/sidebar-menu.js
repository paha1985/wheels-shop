import styled from "styled-components";
import { SidebarMenuItem } from "./components";
import { useEffect, useState } from "react";
import { getCategories } from "../../../../http/categoriesAPI";
import { useDispatch, useSelector } from "react-redux";
import { changeCategory } from "../../../../actions/change-category";
import { loadCategories } from "../../../../actions/load-categories";
import { selectCategories } from "../../../../selectors";
import { selectUserRole } from "../../../../selectors/select-user-role";

const SidebarMenuContainer = ({ className }) => {
  const [openLi, setOpenLi] = useState(null);
  //const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const roleId = useSelector(selectUserRole);

  useEffect(() => {
    getCategories().then((data) => {
      dispatch(loadCategories(data));
      //setCategories(data);
    });
  }, [roleId]);

  const categories = useSelector(selectCategories);

  const liClick = (index) => {
    setOpenLi(index === openLi ? null : index);
  };
  return (
    <ul className={className}>
      <li>
        <SidebarMenuItem
          item={"Главная"}
          icon={"fa fa-home"}
          link={"/products"}
          onClick={() => dispatch(changeCategory(null))}
        />
      </li>
      <li className={`sub-meun ${openLi === 0 ? "active" : ""}`}>
        <SidebarMenuItem
          item={"Товары"}
          submenu={true}
          icon="fa fa-briefcase"
          onClick={() => liClick(0)}
          link={"#"}
        />
        <ul>
          {categories.map((category) => {
            return (
              <SidebarMenuItem
                key={category.category_id}
                item={category.category_name}
                link={"/products"}
                onClick={() =>
                  dispatch(
                    changeCategory(category.category_id, category.category_name)
                  )
                }
              />
            );
          })}
        </ul>
      </li>
      {roleId === 1 && (
        <li className={`sub-meun ${openLi === 1 ? "active" : ""}`}>
          <SidebarMenuItem
            item={"Справочники"}
            submenu={true}
            icon="fa fa-book"
            onClick={() => liClick(1)}
            link={"#"}
          />
          <ul>
            <SidebarMenuItem item={"Бренды"} link={"/brands"} />
            <SidebarMenuItem item={"Марки"} link={"/marks"} />
            <SidebarMenuItem item={"Категории"} link={"/categories"} />
            <SidebarMenuItem item={"Свойства товаров"} link={"/properties"} />
            <SidebarMenuItem item={"Пользователи"} link={"/users"} />
          </ul>
        </li>
      )}
      {roleId !== 3 && (
        <li>
          <SidebarMenuItem
            item={"Заказы"}
            icon={"fa fa-credit-card"}
            link={"/orders"}
          />
        </li>
      )}
      <li>
        <SidebarMenuItem
          item={"О компании"}
          icon={"fa fa-handshake-o"}
          link={"/about"}
        />
      </li>
    </ul>
  );
};

export const SidebarMenu = styled(SidebarMenuContainer)`
  height: 100%;
  transition: all 0.3s ease-in-out;

  & ul {
    margin: -2px 0 0;
    padding: 0;
  }
  & li {
    list-style-type: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  & li.active > a {
    color: #1abc9c;
  }
  & li.active ul {
    display: block;
  }
  & li a {
    color: #aeb2b7;
    text-decoration: none;
    display: block;
    padding: 18px 0 18px 0px;
    font-size: 14px;
    line-height: 24px;
    outline: 0;

    -webkit-transition: all 200ms ease-in;
    -moz-transition: all 200ms ease-in;
    -o-transition: all 200ms ease-in;
    -ms-transition: all 200ms ease-in;
    transition: all 200ms ease-in;
  }
  & li a:hover {
    color: #1abc9c;
  }
  & li a span {
    display: inline-block;
  }
  & li a i {
    width: 20px;
    margin-right: 5px;
    padding-top: 5px;
  }
  & li a i .fa-angle-left,
  & li a i .fa-angle-right {
    padding-top: 3px;
    margin-top: 5px;
  }
  & ul {
    display: none;
  }
  & ul li {
    background: #23313f;
    margin-bottom: 0;
    margin-left: 0;
    margin-right: 0;
    border-bottom: none;
  }
  & ul li a {
    font-size: 12px;
    padding-top: 13px;
    padding-bottom: 13px;
    color: #aeb2b7;
  }
`;
