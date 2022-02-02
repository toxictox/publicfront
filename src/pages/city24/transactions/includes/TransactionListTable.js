import { Link as RouterLink, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Link,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";

import MoreMenu from "@comp/MoreMenu";
import Scrollbar from "@comp/Scrollbar";
import { TableStatic } from "@comp/core/tables/index";
import { useTranslation } from "react-i18next";
import { TransactionFilter } from "./index";
import { GroupTable } from "@comp/core/buttons";
import { toLocaleDateTime } from "@lib/date";
import useAuth from "@hooks/useAuth";

const TransactionListTable = (props) => {
  const { data, ...other } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getAccess } = useAuth();

  return (
    <>
      <Card {...other}>
        <CardHeader action={<MoreMenu />} title={t("Transactions List")} />
        <Divider />
        <TransactionFilter callback={props.callback} />
        <Divider />
        <Scrollbar>
          <Box sx={{ minWidth: false }}>
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
                        to={`/city24/transactions/${order.uuid}`}
                        underline="none"
                        variant="subtitle2"
                      ></Link>
                      <Typography color="textSecondary" variant="body2">
                        {toLocaleDateTime(order.createOn)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ width: 450 }}>{order.merchant}</TableCell>
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
                    <TableCell sx={{ color: order.respCodeColor }}>
                      {order.respCode} {order.respMessage}
                    </TableCell>

                    <TableCell align="right">
                      {getAccess("transactions", "details") ? (
                        <GroupTable
                          actionView={() =>
                            navigate(`/city24/transactions/${order.uuid}`)
                          }
                        />
                      ) : null}
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
