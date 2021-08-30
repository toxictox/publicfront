import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Link, TableCell, Switch } from "@material-ui/core";
import { GroupTable } from "@comp/core/buttons";
import { DragHandle } from "@material-ui/icons";
import axios from "@lib/axios";
import { app } from "@root/config";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showConfirm } from "@slices/dialog";

const CascadingModelsListItem = ({ item, switchStatus, removeItem }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChangeSwitch = async (e, id) => {
    await axios
      .patch(`${app.api}/cascade/model/status/${id}`, {
        status: Number(e.target.checked),
      })
      .then((response) => {
        item.status = e.target.checked;
        toast.success(t("Success update"));
      })
      .catch((e) => {
        toast.error(e);
      });
    switchStatus(id, e.target.checked ? false : true);
  };

  return (
    <>
      <TableCell>
        <DragHandle />
      </TableCell>
      <TableCell>{item.priority}</TableCell>
      <TableCell>
        <Link
          color="textLink"
          component={RouterLink}
          to={`/cascading/id/${item.id}`}
          underline="none"
          variant="subtitle2"
        >
          {item.tranTypeName}
        </Link>
      </TableCell>
      <TableCell>{item.gateway}</TableCell>
      <TableCell>{item.gatewayMethod}</TableCell>
      <TableCell>{item.rule}</TableCell>
      <TableCell>
        <Switch
          checked={item.status}
          onChange={(e) => handleChangeSwitch(e, item.id)}
          name={`check[${item.id}]`}
          inputProps={{
            "aria-label": "secondary checkbox",
          }}
        />
      </TableCell>

      <TableCell align={"right"}>
        <GroupTable
          actionView={() => navigate(`/cascading/id/${item.id}`)}
          actionDelete={() => {
            dispatch(
              showConfirm({
                title: t("Do you want to remove"),
                isOpen: true,
                okCallback: removeItem,
              })
            );
          }}
        />
      </TableCell>
    </>
  );
};

export default CascadingModelsListItem;
