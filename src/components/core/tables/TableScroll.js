import {
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
} from "@material-ui/core";
import useMounted from "@hooks/useMounted";
import useSettings from "@hooks/useSettings";

import { useTranslation } from "react-i18next";
import { useStyles } from "./style/table.style";
const TransactionsList = (props) => {
  const mounted = useMounted();
  const { settings } = useSettings();
  const classes = useStyles();
  const { t } = useTranslation();

  // const getItem = useCallback(async () => {
  //   try {
  //     const response = await axios
  //       .get(`${app.api}/transaction/${id}`)
  //       .then((response) => response.data);
  //     if (mounted.current) {
  //       setListData(response);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [mounted]);
  //
  // useEffect(() => {
  //   getItem();
  // }, [getItem]);

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

export default TransactionsList;
