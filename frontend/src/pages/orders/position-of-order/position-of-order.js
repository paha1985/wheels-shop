import { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrderPositions } from "../../../http/ordersAPI";

const PositionOfOrderContainer = ({ className, order_id }) => {
  const [positions, setPositions] = useState([]);
  useEffect(() => {
    getOrderPositions(order_id).then((positions) => setPositions(positions));
  }, []);
  return (
    <ul className={className}>
      {positions.map((position, index) => {
        return <li key={index}> {position.position_name}</li>;
      })}
    </ul>
  );
};

export const PositionOfOrder = styled(PositionOfOrderContainer)`
  color: var(--app-content-main-color);
  margin-top: 10px;

  & .table-row {
    display: flex;
    align-items: center;
    border-radius: 4px;
    height: 100px;
    border: 1px solid var(--app-content-main-color);
    margin: 5px;
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
