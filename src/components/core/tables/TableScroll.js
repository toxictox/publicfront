import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@material-ui/core";

import { useTranslation } from "react-i18next";
import { useStyles } from "./style/table.style";
const TableScroll = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <TableContainer className={classes.container}>
        <Table stickyHeader size="small" aria-label="sticky table">
          {props.header !== undefined ? (
            <TableHead>
              <TableRow>
                {props.header.map((item) => (
                  <TableCell key={item}>{t(item)}</TableCell>
                ))}
              </TableRow>
            </TableHead>
          ) : null}

          <TableBody>{props.children}</TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableScroll;
