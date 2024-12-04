import PropTypes from "prop-types";
import styled from "styled-components";

const IconContainer = ({ className, id, inactive, ...props }) => (
  <div className={className} {...props}>
    <i className={`fa ${id}`} aria-hidden="true"></i>
  </div>
);

export const Icon = styled(IconContainer)`
  font-size: ${({ size }) => size};
  margin: ${({ margin }) => margin};
  color: ${({ disabled }) =>
    disabled ? "#ccc" : "var(--app-content-main-color)"};

  &:hover {
    cursor: ${({ inactive }) => (inactive ? "default" : "pointer")};
  }
`;

Icon.propTypes = {
  id: PropTypes.string.isRequired,
  inactive: PropTypes.bool,
};
