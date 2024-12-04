import styled from "styled-components";
import { Table } from "../../components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertDate } from "../../utils/convertDate";
import { CLOSE_MODAL, openModal } from "../../actions";
import { setLoading } from "../../actions/set-loading";
import { getUsers, removeUser, updateUser } from "../../http/userAPI";
import { ROLE, ROLES } from "../../constants";
import { selectUserRole } from "../../selectors/select-user-role";
import { useNavigate } from "react-router-dom";

export const UsersContainer = ({ className }) => {
  const [users, setUsers] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState("");

  const userRoleId = useSelector(selectUserRole);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userRoleId !== ROLE.ADMIN) {
      return navigate("/");
    }
  }, [userRoleId, navigate]);

  useEffect(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      getUsers().then((data) => {
        setUsers(data);
        dispatch(setLoading(false));
      });
    }, 1000);
  }, [refresh, dispatch]);

  const editUser = (user_id, login, role_id) => {
    setIsEditing(!isEditing);
    setRoleId(role_id);
    setUserId(user_id);
  };

  const saveEditedUser = (userId, roleId) => {
    updateUser(roleId, userId).then(() => {
      setIsEditing(false);
      setRefresh(!refresh);
      setRoleId("");
    });
  };

  const onUserRemove = (id) => {
    dispatch(
      openModal({
        text: "Удалить пользователя?",
        onConfirm: () => {
          removeUser(id).then(() => {
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
          <Table headers={["Логин", "Роль", "Дата создания", "Действия"]}>
            {users.map((user) => {
              return (
                <div className="table-row" key={user.user_id}>
                  <div className="table-cell">{user.login}</div>

                  <div className="table-cell">
                    <select
                      value={
                        isEditing && userId === user.user_id
                          ? roleId
                          : user.staff_id
                      }
                      onChange={(e) => setRoleId(e.target.value)}
                      disabled={!(isEditing && userId === user.user_id)}
                    >
                      {ROLES.map((role) => {
                        return (
                          <option key={role.role_id} value={role.role_id}>
                            {role.role_name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="table-cell">{convertDate(user.cu_date)}</div>
                  <div className="table-cell">
                    <div
                      className="actionButton"
                      style={{
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        isEditing
                          ? saveEditedUser(
                              user.user_id,
                              roleId ? roleId : user.staff_id
                            )
                          : editUser(user.user_id, user.login, user.role_id);
                      }}
                    >
                      <i
                        className={
                          isEditing ? "fa fa-floppy-o" : "fa fa-pencil-square-o"
                        }
                        aria-hidden="true"
                      ></i>
                      <span style={{ margin: "10px", fontSize: "12px" }}>
                        {isEditing && userId === user.user_id
                          ? "Сохранить"
                          : "Редактировать"}
                      </span>
                    </div>
                    <div
                      className="actionButton"
                      onClick={() => onUserRemove(user.user_id)}
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

export const Users = styled(UsersContainer)`
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

  & select {
    width: 150px;
    height: 25px;
    color: var(--app-content-main-color);
    background: var(--app-bg);
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
