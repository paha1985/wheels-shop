import styled from "styled-components";

const tableContainer = ({ className, headers, children }) => {
  return (
    <div className={className}>
      <div className="table-header">
        {headers.map((header, index) => {
          return (
            <div className="table-cell" key={index}>
              {header}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  );
};

export const Table = styled(tableContainer)`
  width: 100%;
  max-height: 100%;
  overflow: auto;
  padding: 0 4px;

  & .table-header {
    display: flex;
    align-items: center;
    border-radius: 4px;
    background-color: var(--app-content-secondary-color);
    position: sticky;
    top: 0;
  }
  & .table-cell {
    flex: 1;
    padding: 8px 16px;
    color: var(--app-content-main-color);
    font-size: var(--font-small);
    display: flex;
    align-items: center;
  }
`;
