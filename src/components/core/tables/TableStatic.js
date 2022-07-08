import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import './style/TableStatic.scss';

const TableStatic = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <TableContainer>
        <Table stickyHeader size="small" aria-label="table">
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

export default TableStatic;
