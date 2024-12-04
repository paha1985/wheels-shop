import { Link } from "react-router-dom";

export const SidebarMenuItem = ({ item, submenu, icon, onClick, link }) => {
  return (
    <>
      <Link to={`${link}`} onClick={onClick}>
        {icon && <i className={`${icon}`} aria-hidden="true"></i>}
        <span>{item}</span>
        {submenu && <i className="arrow fa fa-angle-right pull-right"></i>}
      </Link>
    </>
  );
};
