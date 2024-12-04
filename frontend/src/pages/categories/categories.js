import styled from "styled-components";
import { Input, Table } from "../../components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../../selectors/select-user-id";
import { convertDate } from "../../utils/convertDate";
import { CLOSE_MODAL, openModal } from "../../actions";
import { setLoading } from "../../actions/set-loading";
import { Pagination } from "../../components/pagination/pagination";
import {
  removeCategorie,
  createCategorie,
  getCategories,
  getCategoryCount,
  updateCategorie,
} from "../../http/categoriesAPI";
import { loadCategories } from "../../actions/load-categories";
import { selectUserRole } from "../../selectors/select-user-role";
import { useNavigate } from "react-router-dom";
import { ROLE } from "../../constants";

export const CategoriesContainer = ({ className }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);

  const limit = 16;

  const userRoleId = useSelector(selectUserRole);
  let navigate = useNavigate();

  useEffect(() => {
    if (userRoleId !== ROLE.ADMIN) {
      return navigate("/");
    }
  }, [userRoleId]);

  useEffect(() => {
    dispatch(setLoading(true));
    getCategoryCount().then((data) => setCount(data[0].count));
    setTimeout(() => {
      getCategories(page, limit).then((data) => {
        setCategories(data);
        dispatch(loadCategories(data));
        dispatch(setLoading(false));
      });
    }, 1000);
  }, [refresh, page]);

  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();

  const editCategory = (category_id, category_name) => {
    setIsEditing(!isEditing);
    setEditedCategory(category_name);
    setCategoryId(category_id);
  };

  const saveNewCategory = () => {
    createCategorie(newCategory, userId).then(() => {
      setIsCreating(false);
      setRefresh(!refresh);
      setNewCategory("");

      // getCategories().then((data) => {
      //   dispatch(loadCategories(data));
      // });
    });
  };

  const saveEditedCategory = () => {
    updateCategorie(editedCategory, categoryId, userId).then(() => {
      setIsEditing(false);
      setRefresh(!refresh);
      setEditedCategory("");
    });
  };

  const cancelSave = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditedCategory("");
    setNewCategory("");
    setRefresh(!refresh);
  };

  const onCategoryRemove = (id) => {
    dispatch(
      openModal({
        text: "Удалить категорию?",
        onConfirm: () => {
          removeCategorie(id).then(() => {
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
          <Table
            headers={[
              "Название категории",
              "Имя пользователя",
              "Дата модификации",
              "Действия",
            ]}
          >
            <div className={isCreating ? "table-row" : "table-row hide"}>
              <div className="table-cell">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell">
                <div className="actionButton" onClick={() => saveNewCategory()}>
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
            {categories.map((category) => {
              return (
                <div className="table-row" key={category.category_id}>
                  <div className="table-cell">
                    {isEditing && categoryId === category.category_id ? (
                      <Input
                        value={editedCategory}
                        placeholder="Категория..."
                        onChange={(e) => setEditedCategory(e.target.value)}
                      />
                    ) : (
                      category.category_name
                    )}
                  </div>
                  <div className="table-cell">{category.login}</div>
                  <div className="table-cell">
                    {convertDate(category.cu_date)}
                  </div>
                  <div className="table-cell">
                    <div
                      className="actionButton"
                      style={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        isEditing
                          ? saveEditedCategory()
                          : editCategory(
                              category.category_id_id,
                              category.category_name
                            );
                      }}
                    >
                      <i
                        className={
                          isEditing ? "fa fa-floppy-o" : "fa fa-pencil-square-o"
                        }
                        aria-hidden="true"
                      ></i>
                      <span style={{ margin: "10px", fontSize: "12px" }}>
                        {isEditing && categoryId === category.category_id
                          ? "Сохранить"
                          : "Редактировать"}
                      </span>
                    </div>
                    <div
                      className="actionButton"
                      onClick={() => onCategoryRemove(category.category_id)}
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
          {count > limit && (
            <Pagination
              page={page}
              setPage={setPage}
              lastPage={Math.ceil(count / limit)}
            />
          )}
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

export const Categories = styled(CategoriesContainer)`
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
