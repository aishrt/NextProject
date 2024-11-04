import * as React from "react";
import Paper from "@mui/material/Paper";
import MatTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { colors } from "@/constants/colors";
import TablePagination from "./TablePagination";
import ClientPagination from "./ClientPagination";
import { Box, CircularProgress } from "@mui/material";
import ArchiveIcon from "@mui/icons-material/ArchiveTwoTone";

export interface Column<Entry> {
  field: keyof Entry;
  title: string | React.ReactNode;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
  Cell?({ entry }: { entry: Entry }): React.ReactElement;
}

export type TableProps<Entry> = {
  data: Entry[];
  columns: Column<Entry>[];
  currentPage: number;
  totalEntries: number;
  clientPagination?: boolean;
  handlePageChange?: (e: React.ChangeEvent<unknown>, toGoPage: number) => void;
  loading?: boolean;
  dataPerPage?: number;
};

const Table = <Entry extends {}>({
  data,
  columns,
  currentPage,
  totalEntries = 1,
  clientPagination = true,
  loading = false,
  handlePageChange = () => null,
  dataPerPage = 10,
}: TableProps<Entry>) => {
  if (!data?.length) {
    return (
      <div
        className="flex flex-col items-center justify-center text-gray-500 w-100 h-80"
        style={{ backgroundColor: "rgb(219 230 245)" }}
      >
        <center style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <ArchiveIcon
            fontSize="large"
            style={{ height: "30px", width: "30px" }}
          />
          <h4>No Entries Found</h4>
        </center>
      </div>
    );
  }

  const serialNumberColumn: Column<Entry> = {
    field: "srNo" as keyof Entry,
    title: "Sr. No.",
    minWidth: 70,
    Cell: ({ entry }) => {
      const index = data.indexOf(entry);
      const srNo = (currentPage - 1) * dataPerPage + (index + 1);
      return (
        <span>
          {srNo} 
        </span>
      );
    },
  };

  // serial numbering is added here
  const updatedColumns = [serialNumberColumn, ...columns];

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer className="pb-0 table-content">
        <MatTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {updatedColumns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ backgroundColor: "#F1F4F9", color: "#202224" }}
                >
                  <p className="mb-0">{column.title}</p>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {!loading && (
            <TableBody>
              {data.map((entry, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    {updatedColumns.map((column, index) => {
                      const value = entry[column.field];
                      return (
                        <TableCell key={index} align={column.align}>
                          {column.Cell ? (
                            <column.Cell entry={entry} />
                          ) : (
                            (value as React.ReactNode)
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </MatTable>
      </TableContainer>
      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "200px",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {clientPagination ? (
        <ClientPagination
          totalEntries={totalEntries}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          dataPerPage={dataPerPage}
        />
      ) : (
        <TablePagination
          totalEntries={totalEntries}
          currentPage={currentPage}
          dataPerPage={dataPerPage}
        />
      )}
    </Paper>
  );
};

export default Table;
