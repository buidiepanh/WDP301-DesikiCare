import { Component } from "react";
import { Box, Typography, Button } from "@mui/material";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            textAlign: "center",
            minHeight: 400,
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            🚫 Có lỗi xảy ra với game này
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Xin lỗi, đã có lỗi kỹ thuật xảy ra. Vui lòng thử lại sau.
          </Typography>
          <Button
            variant="contained"
            onClick={this.props.onBack}
            sx={{
              backgroundColor: "#ec407a",
              "&:hover": { backgroundColor: "#d81b60" },
            }}
          >
            Quay lại danh sách
          </Button>
          {process.env.NODE_ENV === "development" && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: 1,
                maxWidth: 600,
              }}
            >
              <Typography variant="caption" color="error">
                Debug Info: {this.state.error && this.state.error.toString()}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
