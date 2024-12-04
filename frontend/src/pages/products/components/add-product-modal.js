import { useEffect, useState } from "react";
import styled from "styled-components";
import { getCategories } from "../../../http/categoriesAPI";
import { getProperties } from "../../../http/propertiesAPI";
import { getMarks } from "../../../http/markAPI";
import {
  createProduct,
  getProduct,
  getProductProperties,
  updateProduct,
} from "../../../http/productsAPI";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductProperties,
  createProductProperty,
} from "../../../http/product-propertiesAPI";
import { getMarksByCategory } from "../../../http/markAPI";
import { CLOSE_MODAL } from "../../../actions";

const AddProductModalContainer = ({
  className,
  isOpen,
  setIsOpen,
  refresh,
  setRefresh,
  isCreating,
  editedId,
}) => {
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedCategorieId, setSelectedCategorieId] = useState(0);
  const [selectedMarkId, setSelectedMarkId] = useState(0);
  const [propValue, setPropValue] = useState([]);
  const [price, setPrice] = useState(0);
  const [oldProduct, setOldProduct] = useState(0);
  const [file, setFile] = useState(null);

  const productId = useSelector(({ app }) => app.editedData.productId);
  const markId = useSelector(({ app }) => app.editedData.markId);
  const categoryId = useSelector(({ app }) => app.editedData.categoryId);
  const editedPrice = useSelector(({ app }) => app.editedData.price);

  if (oldProduct !== productId) {
    if (!isCreating) {
      setSelectedMarkId(markId);
      setSelectedCategorieId(categoryId);
      setPrice(editedPrice);
      setOldProduct(productId);
    } else {
      setSelectedMarkId(0);
      setSelectedCategorieId(0);
      setPrice("");
      setOldProduct(productId);
    }
  }

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);

      if (isCreating) {
        setSelectedCategorieId(data[0].category_id);
        getProperties(data[0].category_id).then((data) => setProperties(data));
        getMarksByCategory(data[0].category_id).then((data) => {
          setMarks(data);
          setSelectedMarkId(data[0].mark_id);
        });
      } else {
        setSelectedCategorieId(categoryId);
        getProperties(categoryId).then((data) => setProperties(data));
        getMarksByCategory(categoryId).then((data) => setMarks(data));
      }
    });

    if (!isCreating && productId) {
      getProductProperties(productId).then((data) => {
        let pr = data.map((item) => item.value);
        setPropValue(pr);
      });
    } else {
      setPropValue([]);
    }
  }, [editedId, isCreating, categoryId, productId]);

  const onCategorieChange = ({ target }) => {
    setSelectedCategorieId(Number(target.value));
    getProperties(Number(target.value)).then((data) => setProperties(data));
    getMarksByCategory(Number(target.value)).then((data) => setMarks(data));
  };

  const onMarkChange = ({ target }) => {
    setSelectedMarkId(Number(target.value));
  };

  function changeHandler(index, event) {
    setPropValue([
      ...propValue.slice(0, index),
      event.target.value,
      ...propValue.slice(index + 1),
    ]);
  }

  if (!isOpen) {
    return null;
  }

  const onConfirm = () => {
    var formData = new FormData(); // Currently empty
    formData.append(`selectedMarkId`, `${selectedMarkId}`);
    formData.append(`selectedCategorieId`, `${selectedCategorieId}`);
    formData.append(`price`, `${price}`);
    formData.append(`file`, file);
    !isCreating && formData.append(`productId`, productId);
    //createProduct(formData);

    isCreating
      ? createProduct(formData).then(
          //createProduct(selectedMarkId, selectedCategorieId, price, file).then(
          (data) => {
            properties.map((property, index) => {
              return createProductProperty(
                data.product_id,
                property.property_id,
                propValue[index]
              );
            });
            setIsOpen(false);
            setRefresh(!refresh);
          }
        )
      : updateProduct(formData, productId).then((data) => {
          deleteProductProperties(productId).then(() =>
            properties.map((property, index) => {
              return createProductProperty(
                productId,
                property.property_id,
                propValue[index]
              );
            })
          );
          setIsOpen(false);
          setRefresh(!refresh);
        });
  };

  const setPhotoFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className={className}>
      <div className="overlay"></div>
      <div className="box">
        {isCreating ? <h3>Добавить товар</h3> : <h3>Редактировать товар</h3>}

        <div className="prop">
          <span style={{ marginRight: "10px" }}>Категория</span>
          <select value={selectedCategorieId} onChange={onCategorieChange}>
            {categories.map((category) => {
              return (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="prop">
          <span style={{ marginRight: "10px" }}>Марка</span>
          <select value={selectedMarkId} onChange={onMarkChange}>
            {marks.map((mark) => {
              return (
                <option key={mark.mark_id} value={mark.mark_id}>
                  {mark.brand_name} {mark.mark}
                </option>
              );
            })}
          </select>
        </div>

        <div className="prop">
          <span style={{ marginRight: "10px" }}>Цена</span>
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>

        <div className="prop">
          <span style={{ marginRight: "10px" }}>Фото</span>
          <input type={"file"} onChange={(event) => setPhotoFile(event)} />
        </div>

        {properties.map((property, index) => {
          return (
            <div className="prop" key={index}>
              <span style={{ marginRight: "10px" }}>
                {property.description}
              </span>
              <input
                value={propValue[index] || ""}
                onChange={(event) => changeHandler(index, event)}
              />
            </div>
          );
        })}

        <div className="buttons">
          <button style={{ width: "120px" }} onClick={() => onConfirm()}>
            Да
          </button>
          <button style={{ width: "120px" }} onClick={() => setIsOpen(false)}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export const AddProductModal = styled(AddProductModalContainer)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;

  & .prop {
    min-width: 300px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  & input,
  select {
    width: 190px;
  }

  & .overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }

  & .box {
    position: relative;
    top: 50%;
    transform: translate(0, -50%);
    width: 400px;
    margin: 0 auto;
    padding: 0 20px 20px;
    text-align: center;
    background: var(--app-bg);
    color: var(--app-content-main-color);
    border: 3px solid #fff;
    z-index: 30;
  }

  & .buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    height: 25px;
  }

  & .buttons button {
    margin: 0 5px;
  }
`;
