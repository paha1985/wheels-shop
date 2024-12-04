import styled from "styled-components";
import { Logo } from "./components/logo/logo";
import { SidebarMenu } from "./components/sidebar-menu/sidebar-menu";
import { AccountInfo } from "./components";

const SidebarContainer = ({ className }) => {
  return (
    <div className={className}>
      <Logo />
      <SidebarMenu />
    </div>
  );
};

export const Sidebar = styled(SidebarContainer)`
  flex-basis: 250px;
  max-width: 250px;
  flex-shrink: 0;
  background-color: var(--sidebar);
  display: flex;
  flex-direction: column;
`;
