import axios from "axios";

const REST_API_URL = "http://localhost:8080/amount";

export const saveBackendAmount = (amount) => {
  axios.post(REST_API_URL, { amount: amount });
  console.log({ amount: amount });
};

export const getBackendAmount = () => {
  return axios.get(REST_API_URL);
};
