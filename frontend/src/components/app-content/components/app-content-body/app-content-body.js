import { styled } from "styled-components";

const AppContentBodyContainer = ({ className, children }) => {
  return <div className={className}>{children}</div>;
};

export const AppContentBody = styled(AppContentBodyContainer)`
  width: 100%;
  max-height: 100%;
  overflow: auto;
`;
