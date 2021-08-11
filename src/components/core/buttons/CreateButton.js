import PropTypes from "prop-types";
import { ButtonGroup, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const CreateButton = (props) => {
  const { action, text } = props;

  const { t } = useTranslation();

  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
      >
        {action !== undefined ? (
          <Button size={"small"} color={"primary"} onClick={action}>
            {t(text)}
          </Button>
        ) : null}
      </ButtonGroup>
    </>
  );
};

CreateButton.defaultProps = {
  action: undefined,
  text: "",
};

CreateButton.propTypes = {
  action: PropTypes.func,
  text: PropTypes.string,
};

export default CreateButton;
