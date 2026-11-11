import axios from "axios";

export const classifyApiError = (error) => {
  if (!axios.isAxiosError(error)) {
    return {
      status: "failed",
      retryable: false,
    };
  }

  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return {
      status: "failed",
      retryable: true,
    };
  }

  if (!error.response) {
    return {
      status: "failed",
      retryable: true,
    };
  }

  if (error.response.status >= 500) {
    return {
      status: "failed",
      retryable: true,
    };
  }

  return {
    status: "failed",
    retryable: false,
  };
};