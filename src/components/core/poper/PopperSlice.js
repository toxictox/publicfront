import { useState } from "react";
import PropTypes from "prop-types";
import { Popper, Chip, Button } from "@material-ui/core";
import { useStyles } from "./style/popperSlice.style";

const PopperSlice = (props) => {
  const { title, slice } = props;
  const [popper, setPopper] = useState(null);
  const [placement, setPlacement] = useState("right");
  const classes = useStyles();
  const handleClick = (event, placement) => {
    setPopper(popper ? null : event.currentTarget);
    setPlacement(placement);
  };

  const open = Boolean(popper);
  const id = open ? "simple-popper" : undefined;

  return (
    <>
      {title.length ? (
        <Button
          aria-describedby={id}
          variant={props.variant}
          color={props.color}
          type="button"
          size="small"
          onClick={(e) => handleClick(e, props.placement)}
        >
          {`${title.slice(0, slice)}...`}
        </Button>
      ) : null}

      <Popper id={id} open={open} anchorEl={popper} placement={placement}>
        <Chip
          label={title}
          variant="outlined"
          size="small"
          className={classes.bg}
        />
        {/*<div className={classes.paper}> </div>*/}
      </Popper>
    </>
  );
};

PopperSlice.defaultProps = {
  title: "",
  slice: 6,
  placement: "right",
  variant: "contained",
  color: "primary",
};

PopperSlice.propTypes = {
  title: PropTypes.string,
  slice: PropTypes.number,
  placement: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
};

export default PopperSlice;
