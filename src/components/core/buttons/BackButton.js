import PropTypes from "prop-types";
import { Button, Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Backspace } from "@material-ui/icons";
import { useStyles } from "./style/buttons.style";
const BackButton = (props) => {
  const { action } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      {action !== undefined ? (
        <Grid
          container
          justifyContent="space-between"
          spacing={1}
          sx={{ mt: 0 }}
        >
          <Grid xs={12} item>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={action}
              startIcon={<Backspace />}
            >
              {t("Back button")}
            </Button>
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};

BackButton.defaultProps = {
  action: undefined,
};

BackButton.propTypes = {
  action: PropTypes.func,
};

export default BackButton;
