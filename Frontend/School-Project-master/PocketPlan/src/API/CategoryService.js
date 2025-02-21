import axios from "axios";

const REST_API_URL = "http://localhost:8080/categories";

export const deleteBackendCategory = (name) => {
  axios.delete(`${REST_API_URL}/${name}`);
};

export const saveBackendCategory = (category) => {
  axios.post(REST_API_URL, category);
  console.log(category);
};

export const getBackendCategories = () => {
  return axios.get(REST_API_URL);
};
