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
import { selectUserRole } from "../../selectors/select-user-role";
import { useNavigate } from "react-router-dom";
import { ROLE } from "../../constants";

export const BrandsContainer = ({ className }) => {
  const [brands, setBrands] = useState([]);
  const [newBrand, setNewBrand] = useState("");
  const [editedBrand, setEditedBrand] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [brandId, setBrandId] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);

  let navigate = useNavigate();

  const limit = 16;

  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const userRoleId = useSelector(selectUserRole);

  useEffect(() => {
    if (userRoleId !== ROLE.ADMIN) {
      return navigate("/");
    }
  }, [userRoleId]);

  useEffect(() => {
    dispatch(setLoading(true));
    getBrandsCount().then((data) => setCount(data[0].count));
    setTimeout(() => {
      getBrand(page, limit).then((data) => {
        setBrands(data);
        dispatch(setLoading(false));
      });
    }, 1000);
  }, [refresh, page]);

  const editBrand = (brand_id, brand_name) => {
    setIsEditing(!isEditing);
    setEditedBrand(brand_name);
    setBrandId(brand_id);
  };

  const saveNewBrand = () => {
    createBrand(newBrand, userId).then(() => {
      setIsCreating(false);
      setRefresh(!refresh);
      setNewBrand("");
    });
  };

  const saveEditedBrand = () => {
    updateBrand(editedBrand, brandId, userId).then(() => {
      setIsEditing(false);
      setRefresh(!refresh);
      setEditedBrand("");
    });
  };

  const cancelSave = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditedBrand("");
    setNewBrand("");
    setRefresh(!refresh);
  };

  const onBrandRemove = (id) => {
    dispatch(
      openModal({
        text: "Удалить бренд?",
        onConfirm: () => {
          removeBrand(id).then(() => {
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
              "Имя пользователя",
              "Дата модификации",
              "Действия",
            ]}
          >
            <div className={isCreating ? "table-row" : "table-row hide"}>
              <div className="table-cell">
                <Input
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                />
              </div>
              <div className="table-cell"></div>
              <div className="table-cell"></div>
              <div className="table-cell">
                <div className="actionButton" onClick={() => saveNewBrand()}>
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
            {brands.map((brand) => {
              return (
                <div className="table-row" key={brand.brand_id}>
                  <div className="table-cell">
                    {isEditing && brandId === brand.brand_id ? (
                      <Input
                        value={editedBrand}
                        placeholder="Бренд"
                        onChange={(e) => setEditedBrand(e.target.value)}
                      />
                    ) : (
                      brand.brand_name
                    )}
                  </div>
                  <div className="table-cell">{brand.login}</div>
                  <div className="table-cell">{convertDate(brand.cu_date)}</div>
                  <div className="table-cell">
                    <div
                      className="actionButton"
                      style={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        isEditing
                          ? saveEditedBrand()
                          : editBrand(brand.brand_id, brand.brand_name);
                      }}
                    >
                      <i
                        className={
                          isEditing ? "fa fa-floppy-o" : "fa fa-pencil-square-o"
                        }
                        aria-hidden="true"
                      ></i>
                      <span style={{ margin: "10px", fontSize: "12px" }}>
                        {isEditing && brandId === brand.brand_id
                          ? "Сохранить"
                          : "Редактировать"}
                      </span>
                    </div>
                    <div
                      className="actionButton"
                      onClick={() => onBrandRemove(brand.brand_id)}
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

export const Brands = styled(BrandsContainer)`
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
