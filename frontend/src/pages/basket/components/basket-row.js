import { styled } from "styled-components";
import noPhoto from "../../../assets/no photo.jpg";
import { useEffect, useState } from "react";
import {
  getProduct,
  getProductProperties,
  removeProduct,
} from "../../../http/productsAPI";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_MODAL, openModal } from "../../../actions";
import { editProduct } from "../../../actions/edit-product";
import { REACT_APP_API_URL } from "../../../constants";
import { selectUserId } from "../../../selectors/select-user-id";
import { addProductToBasket, removeFromBasket } from "../../../http/basketAPI";
import { QuantityCount } from "./quantity-count";

const BasketRowContainer = ({
  className,
  product,
  refresh,
  setRefresh,
  setIsOpen,
  setIsCreating,
  setEditedId,
  basketId,
  sumOfBasket,
  products,
}) => {
  const [properties, setProperties] = useState([]);
  const [basket, setBasket] = useState(0);
  const [stat, setStatus] = useState(true);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  useEffect(() => {
    product.product_id &&
      getProductProperties(product.product_id).then((data) =>
        setProperties(data)
      );
    getProduct(product.product_id).then((data) =>
      data.basket_id ? setBasket(data.basket_id) : setBasket(0)
    );
  }, [product, stat]);

  const onProductEdit = () => {
    setIsOpen(true);
    setIsCreating(false);
    setEditedId(product.product_id);
    dispatch(
      editProduct({
        productId: product.product_id,
        price: product.price,
        markId: product.mark_id,
        categoryId: product.category_id,
      })
    );
  };

  const onProductRemove = (id) => {
    dispatch(
      openModal({
        text: "Удалить товар?",
        onConfirm: () => {
          removeProduct(id).then(() => {
            setRefresh(!refresh);
          });
          dispatch(CLOSE_MODAL);
        },
        onCancel: () => dispatch(CLOSE_MODAL),
      })
    );
  };

  const buyProduct = async () => {
    basket
      ? await removeFromBasket(basket)
      : await addProductToBasket(product.product_id, userId, 1);
    setStatus(!stat);
  };

  return (
    <div className={className}>
      <div
        style={{
          height: "91%",
          display: "flex",
          flexWrap: "wrap",
          margin: "0 15px",
        }}
      >
        <div className="products-cell image">
          <img
            src={product.img ? REACT_APP_API_URL + product.img : noPhoto}
            alt={"Нет фото"}
          />
        </div>

        <div className="product">
          <span>
            {product.brand_name} {product.mark}
          </span>
          <span style={{ display: "flex" }}>
            {properties.map((property) => {
              return (
                <div
                  key={property.product_property_id}
                  style={{ marginRight: "15px" }}
                >
                  <span className="cell-label">{property.description}: </span>
                  <span>{property.value}</span>
                </div>
              );
            })}
          </span>
        </div>
      </div>
      <div className="price-block">
        <QuantityCount
          quantity={product.quantity}
          price={product.price}
          sumOfBasket={sumOfBasket}
          products={products}
          basketId={basketId}
        />
        <div style={{ marginLeft: "60px", alignContent: "center" }}>
          <div
            style={{
              border: "2px solid red",
              borderRadius: "50px",
              width: "30px",
              height: "30px",
            }}
            onClick={() =>
              removeFromBasket(basketId).then(setRefresh(!refresh))
            }
          >
            <i
              className="fa fa-remove"
              aria-hidden="true"
              style={{
                margin: "4px 6px",
                color: "red",
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BasketRow = styled(BasketRowContainer)`
  display: flex;
  justify-content: space-between;
  margin: 8px 8px 8px 22px;
  width: 84vw;
  background-color: var(--app-content-secondary-color);
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  border: 1px solid;

  & .product {
    width: 45vw;
    color: var(--app-content-main-color);
    margin: 0 0 0 15px;
  }

  & .quantity {
    margin-right: 50px;
  }

  & .cell-more-button {
    border: none;
    padding: 2px 0 0 3px;
    border-radius: 4px;
    position: absolute;
    top: 16px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: rgba(16, 24, 39, 0.7);
    color: #fff;
    cursor: pointer;
    display: none;
  }

  & .cell-trash-button {
    right: 44px;
    padding: 2px 0 0 1px;
  }

  & .cell-edit-button {
    right: 16px;
  }

  &:hover {
    opacity: 0.7;

    & .cell-more-button {
      display: flex;
    }
  }

  & .products-cell {
    color: var(--app-content-main-color);
    font-size: var(--font-small);
    margin-bottom: 2px;
    &:not(.image) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 80px;
    }

    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 4px;
      // margin-bottom: 16px;
    }
  }

  & .cell-label {
    opacity: 0.6;
  }

  .status {
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 4px 8px;
    font-size: 12px;
    &.in-stock {
      color: #2ba972;
      background-color: rgba(43, 169, 114, 0.2);
      &:before {
        background-color: #2ba972;
      }
    }
    &.out-of-stock {
      color: rgb(169 43 97);
      background-color: rgba(169, 43, 97, 0.2);
      &:before {
        background-color: rgb(169 43 97);
      }
    }
    &.shipping {
      color: rgb(89, 113, 157);
      background-color: rgba(89, 113, 157, 0.2);
      &:before {
        background-color: rgb(89, 113, 157);
      }
    }
    &:before {
      content: "";
      width: 4px;
      height: 4px;
      border-radius: 50%;
      margin-right: 4px;
    }
  }
  & .price-block {
    margin: 0 3px;
    display: flex;
    justify-content: space-between;
  }

  & .buy-button {
    border: 1px solid;
    font-size: 14px;
    color: var(--app-content-main-color);
    padding: 5px 10px;
  }

  & .buy-button:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  & .fa-shopping-cart {
    margin-right: 10px;
  }
`;
