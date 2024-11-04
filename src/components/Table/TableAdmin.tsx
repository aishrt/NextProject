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

interface Column<Entry> {
  field: keyof Entry;
  title: string;
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
};

const TableAdmin = <Entry extends {}>({
  data,
  columns,
  currentPage,
  totalEntries = 1,
  clientPagination = true,
  loading = false,
  handlePageChange = () => null,
}: TableProps<Entry>) => {
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        background: "#FFF !important",
      }}
    >
      <TableContainer className="pb-0 table-content">
        <MatTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {/* <TableCell
                sx={{ backgroundColor: colors.primary, color: 'white' }}
              >
                Sr. No.
              </TableCell> */}
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{
                    backgroundColor: "#E1F1FA",
                    color: "#262626",
                    fontWeight: "bold",
                  }}
                >
                  <p className="mb-0"> {column.title}</p>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {!loading && (
            <TableBody>
              {data.map((entry, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                    {/* <TableCell>
                        {((currentPage - 1) * 10) + ++i}
                      </TableCell> */}
                    {columns.map((column, index) => {
                      const value = entry[column.field];
                      return (
                        <TableCell
                          key={index}
                          align={column.align}
                          sx={{
                            backgroundColor: "#FFF",
                            color: "#262626",
                          }}
                        >
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
            backgroundColor: "#fff !important",
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
          dataPerPage={10}
        />
      ) : (
        <TablePagination
          totalEntries={totalEntries}
          currentPage={currentPage}
          dataPerPage={10}
        />
      )}
    </Paper>
  );
};
export default TableAdmin;
