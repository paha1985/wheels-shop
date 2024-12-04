import styled from "styled-components";
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
import { getOrders, getOrdersCount, updateOrder } from "../../http/ordersAPI";
import { PositionOfOrder } from "./position-of-order/position-of-order";

const status = [
  { status_id: "1", status_name: "Ждёт оплаты", color: "darkorange" },
  { status_id: "2", status_name: "Оплачен", color: "blue" },
  { status_id: "3", status_name: "Завершен", color: "green" },
  { status_id: "4", status_name: "Отменён", color: "red" },
];

export const OrdersContainer = ({ className }) => {
  const [orders, setOrders] = useState([]);
  const [editedBrand, setEditedBrand] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [brandId, setBrandId] = useState(null);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);

  let navigate = useNavigate();

  const limit = 5;

  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const userRoleId = useSelector(selectUserRole);

  useEffect(() => {
    if (userRoleId === ROLE.GUEST) {
      return navigate("/");
    }
  }, [userRoleId]);

  useEffect(() => {
    dispatch(setLoading(true));
    getOrdersCount(userRoleId == 1 ? 0 : userId).then((data) =>
      setCount(data[0].count)
    );
    setTimeout(() => {
      getOrders(page, limit, userRoleId == 1 ? 0 : userId).then((data) => {
        setOrders(data);
        dispatch(setLoading(false));
      });
    }, 1000);
  }, [refresh, page]);

  const EditOrder = (order_id, status) => {
    updateOrder(order_id, status);
    setRefresh(!refresh);
  };

  const saveNewBrand = () => {
    // createBrand(newBrand, userId).then(() => {
    //   setIsCreating(false);
    //   setRefresh(!refresh);
    //   setNewBrand("");
    // });
  };

  const saveEditedBrand = () => {
    // updateBrand(editedBrand, brandId, userId).then(() => {
    //   setIsEditing(false);
    //   setRefresh(!refresh);
    //   setEditedBrand("");
    // });
  };

  const cancelSave = () => {
    // setIsEditing(false);
    // setIsCreating(false);
    // setEditedBrand("");
    // setNewBrand("");
    // setRefresh(!refresh);
  };

  const onBrandRemove = (id) => {
    // dispatch(
    //   openModal({
    //     text: "Удалить бренд?",
    //     onConfirm: () => {
    //       removeBrand(id).then(() => {
    //         setRefresh(!refresh);
    //       });
    //       dispatch(CLOSE_MODAL);
    //     },
    //     onCancel: () => dispatch(CLOSE_MODAL),
    //   })
    // );
  };

  return (
    <>
      {userRoleId !== 3 ? (
        orders.length > 0 ? (
          <div className={className}>
            {orders.map((order) => {
              return (
                <div className="table-row" key={order.order_id}>
                  <div className="table-cell">
                    Заказ {order.order_id} от {convertDate(order.order_date)}
                    <PositionOfOrder order_id={order.order_id} />
                  </div>
                  <div
                    className="table-cell"
                    style={{
                      color: status.find(
                        (stat) => stat.status_id == order.status
                      ).color,
                    }}
                  >
                    {
                      status.find((stat) => stat.status_id == order.status)
                        .status_name
                    }
                  </div>
                  <div className="table-cell">
                    <div
                      style={{
                        margin: "10px",
                        display: "flex",
                        justifyContent: "end",
                        minWidth: "170px",
                      }}
                    >
                      {order.order_price}
                    </div>
                    <div style={{ display: "flex", justifyContent: "end" }}>
                      {userRoleId === 2 && order.status == 1 && (
                        <button
                          className="orderBtn"
                          onClick={() => EditOrder(order.order_id, 2)}
                        >
                          Оплатить
                        </button>
                      )}
                      {userRoleId === 1 &&
                        order.status != 3 &&
                        order.status != 4 && (
                          <button
                            className="orderBtn"
                            onClick={() => EditOrder(order.order_id, 3)}
                          >
                            Исполнить
                          </button>
                        )}
                      {userRoleId != 3 && order.status === 1 && (
                        <button
                          className="orderBtn"
                          onClick={() => EditOrder(order.order_id, 4)}
                        >
                          Отменить
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
            Заказы не найдены
          </div>
        )
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

export const Orders = styled(OrdersContainer)`
  color: var(--app-content-main-color);
  margin: 0 19px;
  & .table-row {
    display: flex;
    align-items: center;
    border-radius: 4px;
    height: 15vh;
    border: 1px solid var(--app-content-main-color);
    justify-content: space-between;
    margin: 5px;
  }

  & .table-cell {
    padding: 8px 16px;
    color: var(--app-content-main-color);
    font-size: var(--font-small);
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
  & .orderBtn {
    margin: 10px;
    padding: 5px;
  }
`;
