import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { getFromBasket, updateBasket } from "../../../http/basketAPI";
import { useSelector } from "react-redux";
import { selectUserId } from "../../../selectors/select-user-id";

const QuantityCountContainer = ({
  className,
  quantity,
  price,
  sumOfBasket,
  products,
  basketId,
}) => {
  const [quant, setQuant] = useState(0);

  const userId = useSelector(selectUserId);

  useEffect(() => {
    setQuant(quantity);
  }, []);

  return (
    <>
      <div className="products-cell quantity">
        <i
          className="fa fa-minus"
          aria-hidden="true"
          style={{ marginRight: "10px" }}
          onClick={() => {
            quant === 1 ? setQuant(1) : setQuant(Number(quant) - 1);
            updateBasket(basketId, quant - 1).then(() =>
              getFromBasket(userId).then((data) => {
                sumOfBasket(data);
              })
            );
            sumOfBasket(products);
          }}
        ></i>
        <div style={{ padding: "5px 10px", border: "1px solid" }}>{quant}</div>
        <i
          className="fa fa-plus"
          aria-hidden="true"
          style={{ marginLeft: "10px" }}
          onClick={() => {
            updateBasket(basketId, quant + 1).then(() =>
              getFromBasket(userId).then((data) => {
                sumOfBasket(data);
              })
            );
            setQuant(Number(quant) + 1);
          }}
        ></i>
      </div>
      <div className="products-cell quantity">{price} руб.</div>
      <div className="products-cell season">{price * quant} руб.</div>
    </>
  );
};

export const QuantityCount = styled(QuantityCountContainer)``;
