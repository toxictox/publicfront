import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    "& > div > div": {
      paddingTop: "4px",
      paddingBottom: "4px",
    },
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "&:hover": {
        "& > fieldset": {
          border: "1px solid #fff",
        },
      },
      "& > fieldset": {
        border: "1px solid #fff",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  },
}));
