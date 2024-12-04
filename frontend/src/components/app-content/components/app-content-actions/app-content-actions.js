import { styled } from "styled-components";
import { Input } from "../../../input/input";
import { Icon } from "../../../icon/icon";

const AppContentActionsContainer = ({ className, search, setSearch }) => {
  return (
    <div className={className}>
      <Input
        placeholder="Поиск"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* <div className="buttons">
        <div>
          <button className="action-button">
            <span style={{ marginRight: "4px" }}>Фильтр</span>
            <Icon id="fa-filter" size="19px" />
          </button>
        </div>

        <button className="action-button">
          <Icon id="fa-list" size="19px" />
        </button>
        <button className="action-button">
          <Icon id="fa-th" size="19px" />
        </button>
      </div> */}
    </div>
  );
};

export const AppContentActions = styled(AppContentActionsContainer)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 24px;
  & .buttons {
    display: flex;
    align-items: center;
    margin-left: auto;
  }
  & .action-button {
    border-radius: 4px;
    height: 32px;
    background-color: var(--app-content-secondary-color);
    border: 1px solid var(--app-content-secondary-color);
    display: flex;
    align-items: center;
    color: var(--app-content-main-color);
    font-size: var(--font-small);
    margin-left: 8px;
    cursor: pointer;
  }

  & .action-button:hover {
    border-color: var(--action-color-hover);
  }

  & .action-button:focus,
  .action-button .active {
    outline: none;
    color: var(--action-color);
    border-color: var(--action-color);
  }
`;
