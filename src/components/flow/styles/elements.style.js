import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  aside: {
    display: "flex",
    flexDirection: "column",
    height: "60vh",
    marginTop: 20,
    "& li": {
      background: "red",
    },
  },

  li: {
    background: "#fff",
    marginBottom: 5,
  },
  flow: {
    width: "100%",
    height: "100%",
    padding: "25px 0 0 20px",
    "&  path": {
      strokeWidth: 5,
    },

    "& .error > path": {
      strokeWidth: 5,
      stroke: "red",
    },

    "& .success > path": {
      strokeWidth: 5,
      stroke: "green",
    },
  },

  edge: {
    width: 20,
    "& > path": {
      strokeWidth: 5,
    },
  },

  edgeSuccess: {
    width: 20,
    "& > path": {
      strokeWidth: 5,
      color: "green",
    },
  },

  edgeError: {
    width: 20,
    "& > path": {
      strokeWidth: 5,
      color: "red",
    },
  },
}));
