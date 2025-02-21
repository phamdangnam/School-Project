import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Styling/ContentDetail.css";
import { AppContext } from "../AppProvider.jsx";
import ProgressBar from "@ramonak/react-progress-bar";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { RiMenuAddFill } from "react-icons/ri";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { format, addDays } from "date-fns";
import MyChart from "./BarChart.jsx";
import validator from "validator";

const ContentDetail = () => {
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [formTransactions, setFormTransactions] = useState([
    {
      description: "",
      amount: "",
      date: "",
    },
  ]);
  const { categories, amount } = useContext(AppContext);
  const { id } = useParams();
  let category = categories[id];
  let allowance = (category.percentage * amount) / 100;
  const [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    const dateIsValid = (word) => {
      const tomorrow = format(addDays(new Date(), 1), "MM/dd/yyyy");
      if (!word || typeof word !== "string") {
        return false;
      }
      const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!regex.test(word)) {
        return false;
      }
      return validator.isBefore(word, tomorrow);
    };
    const amountIsValid = (word) => validator.isDecimal(word);
    const validForm = () => {
      if (formTransactions.length === 0) return false;
      for (let transaction of formTransactions) {
        if (
          transaction.description.trim() === "" ||
          !amountIsValid(transaction.amount) ||
          !dateIsValid(transaction.date)
        ) {
          return false;
        }
      }
      return true;
    };
    const formIsValid = validForm();
    setSaveDisabled(!formIsValid);
  }, [formTransactions]);

  const addTransaction = () => {
    const updatedFormTransactions = [
      ...formTransactions,
      {
        description: "",
        amount: "",
        date: "",
      },
    ];
    setFormTransactions(updatedFormTransactions);
  };

  const deleteTransaction = (index) => {
    let updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);
  };

  const deleteFormTransaction = (index) => {
    let updatedFormTransactions = [...formTransactions];
    updatedFormTransactions.splice(index, 1);
    setFormTransactions(updatedFormTransactions);
  };

  const handleSubmit = (e) => {
    const updatedTransactions = [...transactions, ...formTransactions];

    setTransactions(updatedTransactions);

    let newAmount = 0;
    for (const transaction of updatedTransactions) {
      newAmount += Number(transaction.amount);
    }
    setCurrentPercentage((newAmount / amount) * 100);

    const blankFormTransactions = [
      {
        description: "",
        amount: "",
        date: "",
      },
    ];
    setFormTransactions(blankFormTransactions);
    e.preventDefault();
    setShowForm(false);
  };

  return (
    <div className="budget-container">
      <div className="content">
        <div className="main-content">
          <div className="wallet-header">
            <div className="wallet-title">
              <RiMoneyDollarCircleFill className="dollarIcon" />
              <div>
                <h2>{category.category}</h2>
              </div>
            </div>
          </div>

          <div className="transaction-date">
            <ProgressBar
              completed={currentPercentage}
              customLabel={`$${
                (currentPercentage * allowance) / 100
              }/$${allowance}`}
              height="40px"
              borderRadius="22px"
              bgColor="#00b4d8"
            />
          </div>

          <MyChart data={transactions} />
        </div>

        {showForm && (
          <div id="formContainer">
            <div id="formBox">
              <form id="form" onSubmit={handleSubmit}>
                {formTransactions.map((item, index) => (
                  <div key={index} id="formDiv">
                    <div id="descriptionDiv">
                      <h4>Description:</h4>
                      <input
                        id="formInput"
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updatedFormTransactions = [...formTransactions];
                          updatedFormTransactions[index].description =
                            e.target.value;
                          setFormTransactions(updatedFormTransactions);
                        }}
                      />
                    </div>
                    <div id="amountDiv">
                      <h4>Amount:</h4>
                      <input
                        id="formInput"
                        type="text"
                        value={item.amount}
                        onChange={(e) => {
                          const updatedFormTransactions = [...formTransactions];
                          updatedFormTransactions[index].amount =
                            e.target.value;
                          setFormTransactions(updatedFormTransactions);
                        }}
                      />
                    </div>
                    <div id="dateDiv">
                      <h4>Date:</h4>
                      <input
                        id="formInput"
                        type="text"
                        value={item.date}
                        onChange={(e) => {
                          const updatedFormTransactions = [...formTransactions];
                          updatedFormTransactions[index].date = e.target.value;
                          setFormTransactions(updatedFormTransactions);
                        }}
                      />
                    </div>
                    <div id="deleteButton">
                      <MdDelete onClick={() => deleteFormTransaction(index)} />
                    </div>
                  </div>
                ))}

                <div id="formDiv">
                  <RiMenuAddFill id="addIcon" onClick={addTransaction} />
                  <h3 id="addText">Add Category</h3>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    id={saveDisabled ? "disabledButton" : "formButton"}
                    type="submit"
                    disabled={saveDisabled}
                  >
                    Save
                  </button>
                  <button
                    id={saveDisabled ? "disabledButton" : "cancelButton"}
                    type="button"
                    disabled={saveDisabled}
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="sidebar">
          <div className="section">
            <div className="section-header">
              <h3>Transactions</h3>
              <button className="add-btn" onClick={() => setShowForm(true)}>
                +
              </button>
            </div>
            {transactions.map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-info">
                  <div>
                    <h4>{transaction.description}</h4>
                    <p>{transaction.date}</p>
                  </div>
                </div>
                <div className="transaction-actions">
                  <span className="amount">
                    ${Math.abs(transaction.amount).toFixed(2)}
                  </span>
                  <FaDeleteLeft
                    style={{
                      fontSize: "25px",
                      color: "rgb(229, 59, 82)",
                      cursor: "pointer",
                    }}
                    onClick={() => deleteTransaction(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContentDetail;
