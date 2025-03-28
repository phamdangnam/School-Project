import "../Styling/ContentDetail.css";

// Libraries
import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../AppProvider.jsx";
import ProgressBar from "@ramonak/react-progress-bar";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { RiMenuAddFill } from "react-icons/ri";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { format, addDays, subDays } from "date-fns";
import MyChart from "./BarChart.jsx";
import validator from "validator";
import DatePicker from "react-datepicker";
import { BsEraserFill } from "react-icons/bs";

// API Import
import {
  saveBackendTransaction,
  getBackendTransactions,
  deleteBackendTransaction,
} from "../API/TransactionService.js";

const ContentDetail = () => {
  // State import
  const {
    categories,
    amount,
    messages,
    startDate,
    endDate,
    setMessages,
    transactions,
    setTransactions,
  } = useContext(AppContext);

  // Used for filter date
  const [filterDate, setFilterDate] = useState("");

  // Used for display on progress bar
  const [currentPercentage, setCurrentPercentage] = useState(0);

  // Retrieve category index in url
  const { id } = useParams();
  let category = categories[id].category;

  // Retrieve category percentage and amount
  let categoryPercentage = categories[id].percentage;
  let allowance = (categoryPercentage * amount) / 100;

  // Transaction form
  const [showForm, setShowForm] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [formTransactions, setFormTransactions] = useState([
    {
      description: "",
      amount: "",
      date: "",
    },
  ]);

  // Display transactions according to filter date
  useEffect(() => {
    const fetchFilteredTransactions = async () => {
      const response = await getBackendTransactions(category);
      const transactionsWithCategory = response.data;
      const transactions = transactionsWithCategory.map(
        // eslint-disable-next-line no-unused-vars
        ({ category, ...rest }) => rest
      );
      if (filterDate != "") {
        const date = format(filterDate, "MM/dd/yyyy");
        const filteredTransactions = transactions.filter(
          (transaction) => transaction.date == date
        );
        setTransactions(filteredTransactions);
        let amount = 0;
        for (const transaction of filteredTransactions) {
          amount += Number(transaction.amount);
        }
        setCurrentPercentage((amount / allowance) * 100);
      } else {
        let amount = 0;
        for (const transaction of transactions) {
          amount += Number(transaction.amount);
        }
        setCurrentPercentage((amount / allowance) * 100);
        setTransactions(transactions);
      }
    };
    fetchFilteredTransactions();
  }, [filterDate]);

  // Percentage monitoring
  // Used for notifications window
  useEffect(() => {
    let newMessages = [...messages];
    // Check if a message mentioning the category already exists
    let existingMessage = messages.filter((message) =>
      message.includes(` ${category} `)
    );
    // Remove the old message
    if (existingMessage.length != 0)
      newMessages.splice(messages.indexOf(existingMessage), 1);
    // Display new message according to current percentage
    if (currentPercentage >= 100) {
      newMessages.push(
        `You've surpassed your monthly limit in ${category} ❌ (💲${Math.round(
          (allowance * currentPercentage) / 100
        )}/💲${allowance}) `
      );
    } else if (currentPercentage >= 80) {
      newMessages.push(
        `You've almost reach your monthly limit in ${category} 😥 (💲${Math.round(
          (allowance * currentPercentage) / 100
        )}/💲${allowance}) `
      );
    }
    setMessages(newMessages);
  }, [currentPercentage]);

  // Page load fetch
  // Fetch transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await getBackendTransactions(category);
      const transactionsWithCategory = response.data;
      const transactions = transactionsWithCategory.map(
        // eslint-disable-next-line no-unused-vars
        ({ category, ...rest }) => rest
      );

      setTransactions(transactions);
      let amount = 0;
      for (const transaction of transactions) {
        amount += Number(transaction.amount);
      }
      setCurrentPercentage((amount / allowance) * 100);
    };
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Form validation
  // No fields are left blank and amount field is a valid number
  useEffect(() => {
    const amountIsValid = (word) => validator.isDecimal(word);
    const validForm = () => {
      if (formTransactions.length === 0) return false;
      for (let transaction of formTransactions) {
        if (
          transaction.description.trim() === "" ||
          !amountIsValid(transaction.amount) ||
          transaction.date.length == 0
        ) {
          return false;
        }
      }
      return true;
    };
    const formIsValid = validForm();
    setSaveDisabled(!formIsValid);
  }, [formTransactions]);

  // Update form transactions
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

  const deleteFormTransaction = (index) => {
    let updatedFormTransactions = [...formTransactions];
    updatedFormTransactions.splice(index, 1);
    setFormTransactions(updatedFormTransactions);
  };

  // Delete made transaction
  const deleteTransaction = (index) => {
    let updatedTransactions = [...transactions];
    updatedTransactions.splice(index, 1);
    setTransactions(updatedTransactions);
    deleteBackendTransaction(transactions[index].description);

    let newAmount = 0;
    for (const transaction of updatedTransactions) {
      newAmount += Number(transaction.amount);
    }
    setCurrentPercentage((newAmount / allowance) * 100);
  };

  const handleSubmit = (e) => {
    // Display form transactions with made transactions
    const updatedTransactions = [...transactions, ...formTransactions];
    setTransactions(updatedTransactions);

    // Update current percentage on progress bar
    let newAmount = 0;
    for (const transaction of updatedTransactions) {
      newAmount += Number(transaction.amount);
    }
    setCurrentPercentage((newAmount / allowance) * 100);

    // Store new transactions in backend
    for (let transaction of formTransactions) {
      saveBackendTransaction({ category, ...transaction });
    }

    // Reset
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
                <h2>{category}</h2>
              </div>
            </div>
          </div>

          <div className="transaction-date">
            <ProgressBar
              completed={currentPercentage}
              customLabel={`$${Math.round(
                (currentPercentage * allowance) / 100
              )}/$${allowance}`}
              height="40px"
              borderRadius="22px"
              bgColor="#00b4d8"
            />
          </div>
          <div id="chart">
            <MyChart data={transactions} />
          </div>
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
                      <DatePicker
                        id="formInput"
                        selected={item.date}
                        onChange={(date) => {
                          const updatedFormTransactions = [...formTransactions];
                          updatedFormTransactions[index].date = format(
                            date,
                            "MM/dd/yyyy"
                          );
                          setFormTransactions(updatedFormTransactions);
                        }}
                        excludeDateIntervals={[
                          {
                            start: subDays(startDate, 9999),
                            end: subDays(startDate, 1),
                          },
                          {
                            start: addDays(endDate, 1),
                            end: addDays(endDate, 9999),
                          },
                        ]}
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
                    id="cancelButton"
                    type="button"
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
            <div className="section-header">
              <DatePicker
                id="dateFilter"
                selected={filterDate}
                onChange={(date) => setFilterDate(date)}
                excludeDateIntervals={[
                  {
                    start: subDays(startDate, 9999),
                    end: subDays(startDate, 1),
                  },
                  {
                    start: addDays(endDate, 1),
                    end: addDays(endDate, 9999),
                  },
                ]}
              />
              <BsEraserFill
                className="clear-btn"
                onClick={() => {
                  let clear = "";
                  setFilterDate(clear);
                }}
              />
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
