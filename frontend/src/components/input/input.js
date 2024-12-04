import styled from "styled-components";
import { forwardRef } from "react";

const InputContainer = forwardRef(({ className, ...props }, ref) => {
  return <input className={className} {...props} ref={ref} />;
});

export const Input = styled(InputContainer)`
  background-color: var(--app-content-secondary-color);
  border: 1px solid var(--app-content-main-color);
  color: var(--app-content-main-color);
  font-size: var(--font-small);
  line-height: 24px;
  border-radius: 4px;
  padding: 0px 10px 0px 32px;
  height: 32px;
  background-size: 16px;
  background-repeat: no-repeat;
  background-position: left 10px center;
  width: 100%;
  max-width: 320px;
  transition: 0.2s;
`;
