import { useSelector } from "react-redux";
import { selectModalIsChildrenOpen } from "../../selectors";
import styled from "styled-components";

const ModalChildrenContainer = ({ className, children }) => {
  const isOpen = useSelector(selectModalIsChildrenOpen);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={className}>
      <div className="overlay"></div>
      <div className="box">{children}</div>
    </div>
  );
};

export const ModalChildren = styled(ModalChildrenContainer)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;

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
    background: var(--filter-reset);
    border: 3px solid #fff;
    z-index: 30;
  }

  & .buttons {
    display: flex;
    justify-content: center;
  }

  & .buttons button {
    margin: 0 5px;
  }
`;
