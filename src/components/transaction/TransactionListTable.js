import { Link as RouterLink } from "react-router-dom";
// import { format } from "date-fns";
// import numeral from "numeral";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import ArrowRightIcon from "@icons/ArrowRight";
import PencilAltIcon from "@icons/PencilAlt";
import Label from "@comp/Label";
import MoreMenu from "@comp/MoreMenu";
import Scrollbar from "@comp/Scrollbar";
// import OrderListBulkActions from "./OrderListBulkActions";

const TransactionListTable = (props) => {
  const { data, ...other } = props;

  return (
    <>
      <Card {...other}>
        <CardHeader action={<MoreMenu />} title="Orders" />
        <Divider />
        <Scrollbar>
          <Box sx={{ minWidth: 1150 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>uuid</TableCell>
                  <TableCell>amount</TableCell>
                  <TableCell>gateway</TableCell>
                  <TableCell>pan</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((order) => {
                  return (
                    <TableRow hover key={order.uuid}>
                      <TableCell>
                        <Link
                          color="textPrimary"
                          component={RouterLink}
                          to="/dashboard/orders/1"
                          underline="none"
                          variant="subtitle2"
                        >
                          {order.uuid}
                        </Link>
                        <Typography color="textSecondary" variant="body2">
                          {order.createOn}
                          {/*{format(order.createOn, "dd MMM yyyy | HH:mm")}*/}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="textPrimary" variant="subtitle2">
                          {order.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {order.gateway}
                        {/*{numeral(order.totalAmount).format(*/}
                        {/*  `${order.currency}0,0.00`*/}
                        {/*)}*/}
                      </TableCell>
                      <TableCell>{order.pan}</TableCell>
                      <TableCell align="right">
                        <IconButton>
                          <PencilAltIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          component={RouterLink}
                          to="/dashboard/orders/1"
                        >
                          <ArrowRightIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
