import styled from "styled-components";
import { Input, Table } from "../../components";
import {
  updateBrand,
  createBrand,
  getBrand,
  removeBrand,
  getBrandsCount,
} from "../../http/brandAPI";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../../selectors/select-user-id";
import { convertDate } from "../../utils/convertDate";
import { CLOSE_MODAL, openModal } from "../../actions";
import { setLoading } from "../../actions/set-loading";
import { Pagination } from "../../components/pagination/pagination";
import {
  createProperty,
  getProperties,
  removeProperty,
  updateProperty,
} from "../../http/propertiesAPI";
import { selectCategories } from "../../selectors";
import { getCategories } from "../../http/categoriesAPI";
import { selectUserRole } from "../../selectors/select-user-role";
import { useNavigate } from "react-router-dom";
import { ROLE } from "../../constants";

export const PropertiesContainer = ({ className }) => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState("");
  const [editedProperty, setEditedProperty] = useState("");
  const [editedCategory, setEditedCategory] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [propertyId, setPropertyId] = useState(null);

  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);

  const userRoleId = useSelector(selectUserRole);
  let navigate = useNavigate();

  useEffect(() => {
    if (userRoleId !== ROLE.ADMIN) {
      return navigate("/");
    }
  }, [userRoleId]);

  useEffect(() => {
    setEditedCategory(
      categories[0].category_id ? categories[0].category_id : 0
    );
  }, [categories]);

  useEffect(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      getProperties(editedCategory).then((data) => {
        setProperties(data);
        dispatch(setLoading(false));
      });
    }, 1000);
  }, [refresh, editedCategory]);

  const editProperty = (property_id, description) => {
    setIsEditing(!isEditing);
    setEditedProperty(description);
    setPropertyId(property_id);
  };

  const saveNewProperty = () => {
    createProperty(editedCategory, newProperty, userId).then(() => {
      setIsCreating(false);
      setRefresh(!refresh);
      setNewProperty("");
    });
  };

  const saveEditedProperty = () => {
    updateProperty(editedProperty, propertyId, userId).then(() => {
      setIsEditing(false);
      setRefresh(!refresh);
      setEditedProperty("");
    });
  };

  const cancelSave = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditedProperty("");
    setNewProperty("");
    setRefresh(!refresh);
  };

  const onPropertyRemove = (id) => {
    dispatch(
      openModal({
        text: "Удалить свойство?",
        onConfirm: () => {
          removeProperty(id).then(() => {
            setRefresh(!refresh);
          });
          dispatch(CLOSE_MODAL);
        },
        onCancel: () => dispatch(CLOSE_MODAL),
      })
    );
  };

  return (
    <>
      {userRoleId === 1 ? (
        <div className={className}>
          <div style={{ display: "flex", marginLeft: "15px" }}>
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              style={{ marginRight: "15px", height: "35px" }}
            >
              {categories.map((category) => {
                return (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                );
              })}
            </select>
            <div className="addBtnCont">
              <button
                className="addBtn"
                onClick={() => {
                  setIsCreating(true);
                }}
              >
                Добавить
              </button>
            </div>
          </div>

          <Table
            headers={[
              "Свойство",
              "Имя пользователя",
              "Дата модификации",
              "Действия",
            ]}
          >
            <div className={isCreating ? "table-row" : "table-row hide"}>
              <div className="table-cell">
                <Input
                  value={newProperty}
                  onChange={(e) => setNewProperty(e.target.value)}
                />
              </div>
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell">
                <div className="actionButton" onClick={() => saveNewProperty()}>
                  <i className="fa fa-floppy-o" aria-hidden="true"></i>
                  <span style={{ margin: "10px", fontSize: "12px" }}>
                    Сохранить
                  </span>
                </div>
                <div className="actionButton" onClick={() => cancelSave()}>
                  <i className="fa fa-ban" aria-hidden="true"></i>
                  <span style={{ margin: "10px", fontSize: "12px" }}>
                    Отмена
                  </span>
                </div>
              </div>
            </div>
            {properties.map((property) => {
              return (
                <div className="table-row" key={property.property_id}>
                  <div className="table-cell">
                    {isEditing && propertyId === property.property_id ? (
                      <Input
                        value={editedProperty}
                        placeholder="Бренд"
                        onChange={(e) => setEditedProperty(e.target.value)}
                      />
                    ) : (
                      property.description
                    )}
                  </div>
                  <div className="table-cell">{property.login}</div>
                  <div className="table-cell">
                    {convertDate(property.cu_date)}
                  </div>
                  <div className="table-cell">
                    <div
                      className="actionButton"
                      style={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        isEditing
                          ? saveEditedProperty()
                          : editProperty(property.description);
                      }}
                    >
                      <i
                        className={
                          isEditing ? "fa fa-floppy-o" : "fa fa-pencil-square-o"
                        }
                        aria-hidden="true"
                      ></i>
                      <span style={{ margin: "10px", fontSize: "12px" }}>
                        {isEditing && propertyId === property.property_id
                          ? "Сохранить"
                          : "Редактировать"}
                      </span>
                    </div>
                    <div
                      className="actionButton"
                      onClick={() => onPropertyRemove(property.property_id)}
                    >
                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                      <span style={{ margin: "10px", fontSize: "12px" }}>
                        Удалить
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Table>
          {/* <Pagination
        page={page}
        setPage={setPage}
        lastPage={Math.ceil(count / limit)}
      /> */}
        </div>
      ) : (
        <div
          style={{
            color: "var(--app-content-main-color)",
            display: "flex",
            alignItems: "center",
            margin: "auto",
            height: "75vh",
            justifyContent: "center",
          }}
        >
          Доступ запрещен
        </div>
      )}
    </>
  );
};

export const Properties = styled(PropertiesContainer)`
  color: var(--app-content-main-color);
  margin: 0 19px;
  & .table-row {
    display: flex;
    align-items: center;
    border-radius: 4px;
  }

  & .table-cell {
    flex: 1;
    padding: 8px 16px;
    color: var(--app-content-main-color);
    font-size: var(--font-small);
    display: flex;
    align-items: center;
  }

  & .hide {
    display: none;
  }
  & .addBtnCont {
    display: flex;
    justify-content: flex-start;
  }

  & .addBtn {
    height: 35px;
    width: 100px;
    margin: 0 5px 10px 0;
    background: ;
  }
  & i {
    margin-left: 10px;
    margin-bottom: 8px;
    font-size: 12px;
    cursor: pointer;
  }
  & .actionButton {
    border: "1px solid";
    align-items: "center";
    cursor: pointer;
  }

  & span {
    margin: "10px";
    font-size: "12px";
  }
`;
