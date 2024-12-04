import { styled } from "styled-components";
import noPhoto from "../../../../../assets/no photo.jpg";
import { useEffect, useState } from "react";
import {
  getProduct,
  getProductProperties,
  removeProduct,
} from "../../../../../http/productsAPI";
import { useDispatch, useSelector } from "react-redux";
import { CLOSE_MODAL, openModal } from "../../../../../actions";
import { editProduct } from "../../../../../actions/edit-product";
import { REACT_APP_API_URL } from "../../../../../constants";
import { selectUserId } from "../../../../../selectors/select-user-id";
import {
  addProductToBasket,
  removeFromBasket,
} from "../../../../../http/basketAPI";
import { selectUserRole } from "../../../../../selectors/select-user-role";

const ProductsRowContainer = ({
  className,
  product,
  refresh,
  setRefresh,
  setIsOpen,
  setIsCreating,
  setEditedId,
}) => {
  const [properties, setProperties] = useState([]);
  const [basket, setBasket] = useState(0);
  const [stat, setStatus] = useState(true);
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const roleId = useSelector(selectUserRole);

  useEffect(() => {
    product.product_id &&
      getProductProperties(product.product_id).then((data) =>
        setProperties(data)
      );
    getProduct(product.product_id, userId).then((data) =>
      data.basket_id ? setBasket(data.basket_id) : setBasket(0)
    );
  }, [product, stat, roleId]);

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

  const openModals = () => {
    dispatch(
      openModal({
        authorization: true,
      })
    );
  };

  const buyProduct = async () => {
    userId
      ? basket
        ? await removeFromBasket(basket)
        : await addProductToBasket(product.product_id, userId, 1)
      : openModals();

    setStatus(!stat);
  };

  return (
    <div className={className}>
      {roleId === 1 && (
        <button
          className="cell-more-button cell-edit-button"
          onClick={() => onProductEdit()}
        >
          <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
        </button>
      )}
      {roleId === 1 && (
        <button
          className="cell-more-button cell-trash-button"
          onClick={() => onProductRemove(product.product_id)}
        >
          <i className="fa fa-trash-o" aria-hidden="true"></i>
        </button>
      )}
      <div style={{ height: "91%" }}>
        <div className="products-cell image">
          <img
            src={product.img ? REACT_APP_API_URL + product.img : noPhoto}
            alt={"Нет фото"}
          />
          <span>
            {product.brand_name} {product.mark}
          </span>
        </div>

        {properties.map((property, index) => {
          return (
            <div
              // key={property.product_property_id}
              key={index}
              className="products-cell height"
            >
              <span className="cell-label">{property.description}: </span>
              {property.value}
            </div>
          );
        })}
      </div>
      <div className="price-block">
        {roleId === 1 || roleId === 2 ? (
          <div className="buy-button" onClick={() => buyProduct()}>
            <i className="fa fa-shopping-cart" aria-hidden="true"></i>
            {basket !== 0 ? "В корзине" : "Купить"}
          </div>
        ) : (
          <div className="products-cell">Цена</div>
        )}
        <div className="products-cell season">{product.price} руб.</div>
      </div>
    </div>
  );
};

export const ProductsRow = styled(ProductsRowContainer)`
  margin: 8px;
  width: calc(20% - 16px);
  background-color: var(--app-content-secondary-color);
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
  position: relative;
  min-height: 381px;
  border: 1px solid;

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
    }

    img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 4px;
      margin-bottom: 16px;
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
