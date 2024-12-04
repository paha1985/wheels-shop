import { useSelector } from "react-redux";
import {
  selectModalIsOpen,
  selectModalOnCancel,
  selectModalOnConfirm,
  selectModalText,
  selectModalRegistration,
} from "../../selectors";
import styled from "styled-components";
import { selectModalAuthorization } from "../../selectors/select-modal-authorization";
import { Authorization, Registration } from "../../pages";

const ModalContainer = ({ className }) => {
  const isOpen = useSelector(selectModalIsOpen);
  const text = useSelector(selectModalText);
  const onConfirm = useSelector(selectModalOnConfirm);
  const onCancel = useSelector(selectModalOnCancel);
  const authorization = useSelector(selectModalAuthorization);
  const registration = useSelector(selectModalRegistration);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={className}>
      <div className="overlay"></div>
      {!authorization && !registration ? (
        <div className="box">
          <h3>{text}</h3>
          <div className="buttons">
            <button style={{ width: "120px" }} onClick={onConfirm}>
              Да
            </button>
            <button style={{ width: "120px" }} onClick={onCancel}>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="box">
          {authorization ? <Authorization /> : <Registration />}
        </div>
      )}
    </div>
  );
};

export const Modal = styled(ModalContainer)`
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
    background: var(--app-bg);
    border: 3px solid #fff;
    color: var(--app-content-main-color);
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
