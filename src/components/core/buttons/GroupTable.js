import PropTypes from "prop-types";
import { ButtonGroup, Button } from "@material-ui/core";
import { Edit, HighlightOff, Visibility } from "@material-ui/icons";

const GroupTable = (props) => {
  const {
    actionUpdate,
    actionDelete,
    actionView,
    actionCustom,
    actionCustomIcon,
  } = props;

  return (
    <>
      <ButtonGroup variant="text" aria-label="text primary button group">
        {actionCustom !== undefined
          ? actionCustom.map((item) =>
              item.access !== false ? (
                <Button
                  key={item.title}
                  variant={"contained"}
                  size={"small"}
                  color={item.color ? item.color : "primary"}
                  onClick={item.callback}
                >
                  {item.title}
                </Button>
              ) : null
            )
          : null}
        {actionView !== undefined ? (
          <Button size={"small"} color={"primary"} onClick={actionView}>
            <Visibility />
          </Button>
        ) : null}

        {actionCustomIcon !== undefined
          ? actionCustomIcon.map((item) =>
              item.access !== false ? (
                <Button
                  key={item.title}
                  size={"small"}
                  color={"primary"}
                  onClick={item.callback}
                >
                  {item.icon}
                </Button>
              ) : null
            )
          : null}

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
  actionCustom: undefined,
};

GroupTable.propTypes = {
  actionUpdate: PropTypes.func,
  actionDelete: PropTypes.func,
  actionView: PropTypes.func,
  actionCustom: PropTypes.array,
};

export default GroupTable;
