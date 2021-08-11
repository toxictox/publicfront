import PropTypes from "prop-types";
import { ButtonGroup, Button } from "@material-ui/core";
import { Edit, HighlightOff, Visibility } from "@material-ui/icons";
import { useTranslation } from "react-i18next";

const GroupTable = (props) => {
  const { actionUpdate, actionDelete, actionView } = props;

  const { t } = useTranslation();

  return (
    <>
      <ButtonGroup variant="text" aria-label="text primary button group">
        {actionView !== undefined ? (
          <Button size={"small"} color={"primary"} onClick={actionView}>
            <Visibility />
          </Button>
        ) : null}

        {actionUpdate !== undefined ? (
          <Button size={"small"} color={"primary"} onClick={actionUpdate}>
            <Edit />
          </Button>
        ) : null}
        {actionDelete !== undefined ? (
          <Button size={"small"} color={"secondary"} onClick={actionDelete}>
            <HighlightOff />
          </Button>
        ) : null}
      </ButtonGroup>
    </>
  );
};

GroupTable.defaultProps = {
  actionUpdate: undefined,
  actionDelete: undefined,
  actionView: undefined,
};

GroupTable.propTypes = {
  actionUpdate: PropTypes.func,
  actionDelete: PropTypes.func,
  actionView: PropTypes.func,
};

export default GroupTable;
