import { Link as RouterLink, useNavigate } from "react-router-dom";
// import { format } from "date-fns";
// import numeral from "numeral";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Link,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";

import MoreMenu from "@comp/MoreMenu";
import Scrollbar from "@comp/Scrollbar";
import { TableStatic } from "@comp/core/tables/index";
import { useTranslation } from "react-i18next";
import TransactionFilter from "@comp/transaction/TransactionFilter";
import { GroupTable } from "@comp/core/buttons";

const TransactionListTable = (props) => {
  const { data, ...other } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <Card {...other}>
        <CardHeader action={<MoreMenu />} title={t("Transactions List")} />
        <Divider />
        <TransactionFilter />
        <Divider />
        <Scrollbar>
          <Box sx={{ minWidth: 1150 }}>
            <TableStatic
              header={[
                "createOn",
                "merchant",
                "tranId",
                "tranType",
                "pan",
                "amount",
                "fee",
                "gateway",
                "respCode",
                "",
              ]}
            >
              {data.map((order) => {
                return (
                  <TableRow hover key={order.uuid}>
                    <TableCell>
                      <Link
                        color="textPrimary"
                        component={RouterLink}
                        to={`/transaction/${order.uuid}`}
                        underline="none"
                        variant="subtitle2"
                      ></Link>
                      <Typography color="textSecondary" variant="body2">
                        {order.createOn}
                        {/*{format(order.createOn, "dd MMM yyyy | HH:mm")}*/}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.merchant}</TableCell>
                    <TableCell>{order.tranId}</TableCell>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="subtitle2"
                        align={"center"}
                      >
                        {order.tranType}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.pan}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>{order.fee}</TableCell>
                    <TableCell>{order.gateway}</TableCell>
                    <TableCell>{order.respCode}</TableCell>

                    <TableCell align="right">
                      <GroupTable
                        actionView={() =>
                          navigate(`/transaction/${order.uuid}`)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableStatic>
          </Box>
        </Scrollbar>
      </Card>
    </>
  );
};

TransactionListTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default TransactionListTable;
