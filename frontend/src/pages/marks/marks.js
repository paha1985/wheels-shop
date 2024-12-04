import styled from "styled-components";
import { Input, Table } from "../../components";
import { updateBrand, getBrand, removeBrand } from "../../http/brandAPI";
import { useEffect, useState } from "react";
import { createBrand } from "../../http/brandAPI";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../../selectors/select-user-id";
import { convertDate } from "../../utils/convertDate";
import { CLOSE_MODAL, openModal } from "../../actions";
import {
  createMark,
  getMarks,
  getMarksCount,
  removeMark,
  updateMark,
} from "../../http/markAPI";
import { setLoading } from "../../actions/set-loading";
import { getCategories } from "../../http/categoriesAPI";
import { selectUserRole } from "../../selectors/select-user-role";
import { useNavigate } from "react-router-dom";
import { ROLE } from "../../constants";
import { Pagination } from "../../components/pagination/pagination";

export const MarksContainer = ({ className }) => {
  const [marks, setMarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [markName, setMarkName] = useState("");
  const [editedBrand, setEditedBrand] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [markId, setMarkId] = useState(null);
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
    getMarksCount().then((data) => setCount(data[0].count));
    setTimeout(() => {
      getMarks(page, limit).then((data) => {
        setMarks(data);
        dispatch(setLoading(false));
      });
    }, 1000);

    getBrand().then((data) => setBrands(data));
    getCategories().then((categ) => {
      setCategories(categ);
      setEditedCategory(categ[0].category_id);
    });
  }, [refresh, page]);

  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();

  const editMark = (mark_id, brand_id, mark, category_id) => {
    setIsEditing(!isEditing);
    setEditedBrand(brand_id);
    setEditedCategory(category_id);
    setMarkId(mark_id);
    setMarkName(mark);
  };

  const saveNewMark = () => {
    createMark(editedBrand, markName, userId, editedCategory).then(() => {
      setIsCreating(false);
      setRefresh(!refresh);
      setEditedBrand("");
      setMarkName("");
      setEditedCategory("");
    });
  };

  const saveEditedMark = () => {
    updateMark(editedBrand, markName, userId, markId, editedCategory).then(
      () => {
        setIsEditing(false);
        setRefresh(!refresh);
        setEditedBrand("");
        setMarkName("");
        setEditedCategory("");
      }
    );
  };

  const cancelSave = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditedBrand("");
    setMarkName("");
    setEditedCategory("");
    setRefresh(!refresh);
  };

  const onMarkRemove = (id) => {
    dispatch(
      openModal({
        text: "Удалить марку?",
        onConfirm: () => {
          removeMark(id).then(() => {
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
              "Название бренда",
              "Название марки",
              "Категория",
              "Имя пользователя",
              "Дата модификации",
              "Действия",
            ]}
          >
            <div className={isCreating ? "table-row" : "table-row hide"}>
              <div className="table-cell">
                <select
                  value={editedBrand}
                  onChange={(e) => setEditedBrand(e.target.value)}
                >
                  {brands.map((brand) => {
                    return (
                      <option key={brand.brand_id} value={brand.brand_id}>
                        {brand.brand_name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="table-cell">
                <input
                  value={markName}
                  onChange={(e) => setMarkName(e.target.value)}
                />
              </div>
              <div className="table-cell">
                <select
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
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
              </div>
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell">
                <div className="actionButton" onClick={() => saveNewMark()}>
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
            {marks.map((mark) => {
              return (
                <div className="table-row" key={mark.mark_id}>
                  <div className="table-cell">
                    {isEditing && markId === mark.mark_id ? (
                      <select
                        value={editedBrand}
                        onChange={(e) => setEditedBrand(e.target.value)}
                      >
                        {brands.map((brand) => {
                          return (
                            <option key={brand.brand_id} value={brand.brand_id}>
                              {brand.brand_name}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      mark.brand_name
                    )}
                  </div>
                  {isEditing && markId === mark.mark_id ? (
                    <input
                      value={markName}
                      onChange={(e) => setMarkName(e.target.value)}
                    />
                  ) : (
                    <div className="table-cell">{mark.mark}</div>
                  )}
                  <div className="table-cell">
                    {isEditing && markId === mark.mark_id ? (
                      <select
                        value={editedCategory}
                        onChange={(e) => setEditedCategory(e.target.value)}
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
                    ) : (
                      mark.category_name
                    )}
                  </div>
                  <div className="table-cell">{mark.login}</div>
                  <div className="table-cell">{convertDate(mark.cu_date)}</div>
                  <div className="table-cell">
                    <div
                      className="actionButton"
                      style={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        isEditing
                          ? saveEditedMark()
                          : editMark(
                              mark.mark_id,
                              mark.brand_id,
                              mark.mark,
                              mark.category_id
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
                        {isEditing && markId === mark.mark_id
                          ? "Сохранить"
                          : "Редактировать"}
                      </span>
                    </div>
                    <div
                      className="actionButton"
                      onClick={() => onMarkRemove(mark.mark_id)}
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

export const Marks = styled(MarksContainer)`
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