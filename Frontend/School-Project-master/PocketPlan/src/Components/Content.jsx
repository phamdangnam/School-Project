import "../Styling/Content.css";

import { Link } from "react-router-dom";
import { contentDetailsRoute } from "../Data/routes.js";
import { useEffect, useState } from "react";
import PieChart from "./PieChart.jsx";
import axios from "axios";
import { AppContext } from "../AppProvider";
import { useContext } from "react";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import MyChart from "./BarChart.jsx";

// API Import
import { getAllBackendTransactions } from "../API/TransactionService.js";

const Content = () => {
  const [imgs, setImgs] = useState([]);
  const { categories, amount } = useContext(AppContext);
  const [allTransactions, setAllTransactions] = useState([]);

  // Page load fetch
  // Fetch all transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await getAllBackendTransactions();
      const fetchedTransactionsWithCategory = response.data;
      const fetchedTransactions = fetchedTransactionsWithCategory.map(
        // eslint-disable-next-line no-unused-vars
        ({ category, ...rest }) => rest
      );
      setAllTransactions(fetchedTransactions);
    };
    fetchTransactions();
  }, []);

  // Fetch a header image for a category
  useEffect(() => {
    const getImg = async (keyword) => {
      try {
        const { data } = await axios.get(
          `https://api.unsplash.com/search/photos?query={${keyword}}&page=1&per_page=1&client_id=49D1vP6L1n7jL05-rpMXMONwlT_zL-bABOG84zdE_1g`
        );
        const { results } = data;
        const firstSearch = results[0];
        return firstSearch.urls.full;
      } catch (error) {
        console.log(error);
        return null;
      }
    };

    const fetchImages = async () => {
      const imagePromises = categories.map(async (e) => {
        const imgUrl = await getImg(e.category);
        return imgUrl;
      });
      const images = await Promise.all(imagePromises);
      setImgs(images);
    };

    fetchImages();
  }, [categories]);

  return (
    <div id="mainContainer">
      <div id="displayContainer">
        <div id="chart">
          <PieChart />
          <MyChart data={allTransactions} />
        </div>
        <div id="categoriesDiv">
          {categories.map((e, index) => (
            <div id="box" key={index}>
              <Link to={contentDetailsRoute + index}>
                {imgs[index] ? (
                  <img id="categoryImg" src={imgs[index]} />
                ) : (
                  <p>Loading...</p>
                )}
                <div id="details">
                  <h3>{e.category}</h3>

                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div id="dollarIcon">
                      <RiMoneyDollarCircleFill
                        style={{
                          color: "#00b4d8",
                          fontSize: "20px",
                        }}
                      />
                    </div>
                    <h4>{`${(e.percentage * amount) / 100}`}</h4>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Content;
