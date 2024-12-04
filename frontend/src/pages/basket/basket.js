import { useEffect, useLayoutEffect, useState } from "react";
import { ProductsRow } from "../../components/app-content/components/app-content-body/components/products-row";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../actions/set-loading";

import { selectUserId } from "../../selectors/select-user-id";
import {
  getFromBasket,
  getSumOfBasket,
  removeFromBasket,
} from "../../http/basketAPI";
import styled from "styled-components";
import { REACT_APP_API_URL, ROLE } from "../../constants";
import noPhoto from "../../assets/no photo.jpg";
import { getProductProperties } from "../../http/productsAPI";
import { BasketRow } from "./components/basket-row";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { selectUserRole } from "../../selectors/select-user-role";
import { createOrder, createOrderProducts } from "../../http/ordersAPI";

const BasketContainer = ({ className }) => {
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  // const [page, setPage] = useState(1);
  // const [count, setCount] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();

  const userId = useSelector(selectUserId);
  const roleId = useSelector(selectUserRole);

  const category = useSelector(({ app }) => app.currentCategory);
  const loading = useSelector(({ app }) => app.isLoading);

  const [prop, setProp] = useState("");
  const [quant, setQuant] = useState(0);
  let navigate = useNavigate();

  const prodProperties = async (prodId) => {
    const properties = await getProductProperties(prodId);
    let result = "";
    for (let property of properties) {
      result += property.description + " - " + property.value + " ";
    }

    setProp(result);
    return result;
  };

  useEffect(() => {
    if (roleId == ROLE.GUEST) {
      return navigate("/");
    }
  }, [roleId]);

  useEffect(() => {
    products.product_id &&
      prodProperties(products.product_id).then((prop) => {
        setQuant(products.quantity);
        setProp(prop);
      });
  }, [products.product_id]);

  useEffect(() => {
    dispatch(setLoading(true));
    userId &&
      setTimeout(() => {
        getFromBasket(userId).then((data) => {
          setProducts(data ? data : []);
          sumOfBasket(data);
          dispatch(setLoading(false));
        });
      }, 500);
  }, [refresh, userId]);

  const sumOfBasket = (productes) => {
    let sum = 0;
    for (let product of productes) {
      sum += product.quantity * product.price;
    }
    setQuant(sum);
    return sum ? sum : 0;
  };

  const createNewOrder = async (userId, quant, status) => {
    const newOrder = await createOrder(userId, quant, status);
    await createOrderProducts(userId, newOrder.order_id);
    return navigate("/orders");
  };

  return (
    <div className={className}>
      {!loading &&
        (products.length > 0 ? (
          products.map((product) => {
            return (
              <BasketRow
                key={product.product_id}
                product={product}
                basketId={product.basket_id}
                setRefresh={setRefresh}
                refresh={refresh}
                sumOfBasket={sumOfBasket}
                products={products}
              />
            );
          })
        ) : (
          <div
            style={{
              color: "var(--app-content-main-color)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              height: "75vh",
            }}
          >
            Корзина пуста
          </div>
        ))}
      {products.length !== 0 && (
        <>
          <div
            style={{
              color: "var(--app-content-main-color)",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
              margin: "25px",
            }}
          >
            <div>Итого к оплате</div>
            <div>{quant}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <button
              style={{ padding: "10px", marginRight: "22px" }}
              onClick={() => createNewOrder(userId, quant, 1)}
            >
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export const Basket = styled(BasketContainer)``;
