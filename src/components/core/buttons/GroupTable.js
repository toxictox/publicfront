import PropTypes from "prop-types";
import { ButtonGroup, Button } from "@material-ui/core";
import { Edit, HighlightOff, Visibility, AddCircle } from "@material-ui/icons";

const GroupTable = (props) => {
  const {
    actionCreate,
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


        {actionCreate !== undefined &&
        typeof actionCreate === "object" &&
        actionCreate.access !== false ? (
          <Button
            size={"small"}
            color={"primary"}
            onClick={actionCreate.callback}
          >
            <AddCircle />
          </Button>
        ) : actionCreate !== undefined && typeof actionCreate === "function" ? (
          <Button size={"small"} color={"primary"} onClick={actionCreate}>
            <AddCircle />
          </Button>
        ) : null}

        {actionView !== undefined &&
        typeof actionView === "object" &&
        actionView.access !== false ? (
          <Button
            size={"small"}
            color={"primary"}
            onClick={actionView.callback}
          >
            <Visibility />
          </Button>
        ) : actionView !== undefined && typeof actionView === "function" ? (
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

        {actionUpdate !== undefined &&
        typeof actionUpdate === "object" &&
        actionUpdate.access !== false ? (
          <Button
            size={"small"}
            color={"primary"}
            onClick={actionUpdate.callback}
          >
            <Edit />
          </Button>
        ) : actionUpdate !== undefined && typeof actionUpdate === "function" ? (
          <Button size={"small"} color={"primary"} onClick={actionUpdate}>
            <Edit />
          </Button>
        ) : null}

        {actionDelete !== undefined &&
        typeof actionDelete === "object" &&
        actionDelete.access !== false ? (
          <Button
            size={"small"}
            color={"secondary"}
            onClick={actionDelete.callback}
          >
            <HighlightOff />
          </Button>
        ) : actionDelete !== undefined && typeof actionDelete === "function" ? (
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
  actionUpdate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  actionDelete: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  actionView: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  actionCustom: PropTypes.array,
};

export default GroupTable;
