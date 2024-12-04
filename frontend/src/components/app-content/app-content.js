import { styled } from "styled-components";
import {
  AppContentActions,
  AppContentBody,
  AppContentHeader,
} from "./components";

const AppContentContainer = ({
  className,
  children,
  title,
  search,
  setSearch,
  viewSearch,
}) => {
  return (
    <div className={className}>
      <div className="loader hide"></div>
      <AppContentHeader title={title} />
      {viewSearch && (
        <AppContentActions search={search} setSearch={setSearch} />
      )}
      <AppContentBody children={children} />
    </div>
  );
};

export const AppContent = styled(AppContentContainer)`
  padding: 4px;
  background-color: var(--app-bg);
  height: 100%;
  flex: 1;
  max-height: 100%;
  display: flex;
  flex-direction: column;

  .loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 35px;
    height: 35px;
    border: 5px solid var(--app-content-main-color);
    border-radius: 50%;
    border-left-color: transparent;
    animation: loader 1s infinite;
    z-index: 99;
  }

  @keyframes loader {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .hide {
    display: none;
  }
`;
