import { Component } from "react";
import { Typography } from "@material-ui/core";
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Typography variant="h4" component="h4" sx={{ m: 3 }} gutterBottom>
          Ошибка работы приложения. Повторите позже
        </Typography>
      );
    }

    return this.props.children;
  }
}
