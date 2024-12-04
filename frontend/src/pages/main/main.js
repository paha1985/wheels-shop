import { useEffect, useState } from "react";
import styled from "styled-components";
import { getCategories } from "../../http/categoriesAPI";
import { getMarks } from "../../http/markAPI";
import { getProperties } from "../../http/propertiesAPI";

export const MainContainer = ({ className }) => {
  const [categories, setCategories] = useState([]);
  const [marks, setMarks] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedCategorieId, setSelectedCategorieId] = useState(0);
  const [selectedMarkId, setSelectedMarkId] = useState(0);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data);
      setSelectedCategorieId(data[0].category_id);
      getProperties(data[0].category_id).then((data) => setProperties(data));
    });
    getMarks().then((data) => setMarks(data));
  }, []);

  const onCategorieChange = ({ target }) => {
    setSelectedCategorieId(Number(target.value));
    getProperties(Number(target.value)).then((data) => setProperties(data));
  };

  const onMarkChange = ({ target }) => {
    setSelectedMarkId(Number(target.value));
  };

  return (
    <div className={className}>
      <h3>Добавить</h3>
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

      {properties.map((property) => {
        return (
          <div className="prop" key={property.property_id}>
            <span style={{ marginRight: "10px", minWidth: "100px" }}>
              {property.description}
            </span>
            <input />
          </div>
        );
      })}
    </div>
  );
};

export const Main = styled(MainContainer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  flex-direction: column;

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
`;
