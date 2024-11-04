import * as React from 'react';

export const usePagination = (initial = 1) => {
  const [page, setPage] = React.useState(initial);
  const changePage = (page: number) => {
    setPage(page);
  };

  return { page, changePage };
};
