import styled from "styled-components";
import mainLogo from "../../../../assets/logo-white.svg";

const LargeText = styled.div`
  font-size: 30px;
  margin: 0 13px;
  font-weight: 600;
  line-height: 48px;
  color: var(--sidebar-link);
`;

const SmallText = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 45px;
  color: var(--sidebar-link);
`;

const LogoContainer = ({ className }) => (
  <div className={className}>
    <img src={mainLogo} alt="Нет фото" />
    <div>
      <LargeText>Wheels</LargeText>
      <SmallText>shop</SmallText>
    </div>
  </div>
);

export const Logo = styled(LogoContainer)`
  display: flex;

  & img {
    height: 70px;
    margin-top: 5px;
  }
`;
