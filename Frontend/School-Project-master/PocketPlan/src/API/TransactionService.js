import axios from "axios";

const REST_API_URL = "http://localhost:8080/transactions";

export const deleteBackendTransaction = (description) => {
  axios.delete(`${REST_API_URL}/${description}`);
};

export const saveBackendTransaction = (transaction) => {
  axios.post(REST_API_URL, transaction);
  console.log(transaction);
};

export const getBackendTransactions = (category) => {
  return axios.get(`${REST_API_URL}/${category}`);
};

export const getAllBackendTransactions = () => {
  return axios.get(`${REST_API_URL}`);
};
