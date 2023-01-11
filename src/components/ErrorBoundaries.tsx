import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { TbFaceIdError } from "react-icons/tb";

interface Props {
  children: ReactNode;
};

interface State {
  hasError: boolean;
};


class ErrorBoundaries extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false}
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.log(`Something went wrong: ${error.message}`, errorInfo);
    this.setState({hasError: true});
  };
  
  render() {
    if(this.state.hasError) {
      return (
        <Box className="error-boundaries">
          <Box className="inner-wrapper">
            <TbFaceIdError style={{fontSize: "19rem"}} />
            <Typography variant="h2" fontWeight={700}>
              Oh no!
            </Typography>
            <Typography variant="h4">
              Sorry, something went wrong.
            </Typography>
          </Box>
        </Box>
      )
    };

    return this.props.children;
  };
};

export default ErrorBoundaries;
