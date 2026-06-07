import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const options = {
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const API: AxiosInstance = axios.create(options);

API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    let errorMessage = "An unexpected error occurred.";

   
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;

      if (responseData?.errors && Array.isArray(responseData.errors)) {
     
        errorMessage = responseData.errors
          .map((err: any) => `${err.message}`)
          .join(", ")
        error.backendErrors = responseData.errors;
      } else {
       
        errorMessage = responseData?.message || errorMessage;
      }

      console.error(`[API Error] Status ${status}:`, errorMessage);

      if (status === 401) {
        console.warn("Session expired or unauthorized.");
      }
    } else if (error.request) {

      errorMessage =
        "No response received from server. Check your network connection.";
      console.error("[API Error] No response:", error.request);
    } else {
      errorMessage = error.message;
      console.error("[API Error] Setup Message:", error.message);
    }

    error.message = errorMessage;
    return Promise.reject(error);
  },
);

export default API;
