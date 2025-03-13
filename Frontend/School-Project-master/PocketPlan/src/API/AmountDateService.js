import axios from "axios";

const REST_API_URL = "http://localhost:8080/amount";

export const saveBackendAmountAndDate = (amount, dateRange) => {
  axios.post(REST_API_URL, { amount: amount, dateRange: dateRange });
};

export const getBackendAmountAndDate = () => {
  return axios.get(REST_API_URL);
};
