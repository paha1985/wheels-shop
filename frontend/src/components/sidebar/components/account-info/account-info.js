import styled from "styled-components";

const AccountInfoContainer = ({ className }) => {
  return (
    <div className={className}>
      <div className="account-info-picture">П</div>
      <div className="account-info-name">Петров П.</div>
    </div>
  );
};

export const AccountInfo = styled(AccountInfoContainer)`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-top: auto;
  & .account-info-picture {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--app-content-main-color);
    color: var(--app-bg);
    align-content: center;
    text-align: center;
  }
  & .account-info-name {
    font-size: var(--font-small);
    color: var(--sidebar-main-color);
    margin: 0 8px;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
