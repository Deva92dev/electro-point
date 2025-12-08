import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
}

const PaginationControl = ({ currentPage, totalPages }: Props) => {
  return <div>PaginationControl</div>;
};

export default PaginationControl;
