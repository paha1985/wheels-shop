import styled from "styled-components";

const PaginationContainer = ({ className, page, setPage, lastPage }) => {
  return (
    <div className={className}>
      <button disabled={page === 1} onClick={() => setPage(1)}>
        В начало
      </button>
      <button disabled={page === 1} onClick={() => setPage(page - 1)}>
        Предыдущая
      </button>
      <div className="current-page">Страница: {page}</div>
      <button disabled={page === lastPage} onClick={() => setPage(page + 1)}>
        Следующая
      </button>
      <button disabled={page === lastPage} onClick={() => setPage(lastPage)}>
        В конец
      </button>
    </div>
  );
};

export const Pagination = styled(PaginationContainer)`
  position: fixed;
  display: flex;
  justify-content: center;
  padding: 0 35px;
  width: 700px;
  margin: 0 auto;
  top: calc(95vh);
  left: calc(32vw);

  & button {
    margin: 0 5px;
    width: 160px;
  }

  & .current-page {
    width: 100%;
    font-size: 18px;
    font-weight: 500;
    height: 32px;
    border: 1px solid var(--app-content-main-color);
    text-align: center;
    line-height: 26px;
    color: var(--app-content-main-color);
  }
`;
