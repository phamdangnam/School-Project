import "../Styling/Header.css";
import { homeRoute } from "../Data/routes";
import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { RiMenuAddFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { AppContext } from "../AppProvider.jsx";
import { IoMdNotificationsOutline } from "react-icons/io";
import validator from "validator";
import {
  saveBackendCategory,
  deleteBackendCategory,
  getBackendCategories,
} from "../API/CategoryService.js";
import {
  saveBackendAmountAndDate,
  getBackendAmountAndDate,
} from "../API/AmountDateService.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const Header = () => {
  const pathName = useLocation().pathname;
  const [showForm, setShowForm] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);

  const {
    categories,
    amount,
    messages,
    startDate,
    endDate,
    setCategories,
    setAmount,
    setStartDate,
    setEndDate,
  } = useContext(AppContext);

  const [showDropdown, setShowDropdown] = useState(false);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  // Page load fetch
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getBackendCategories();
      const categories = response.data;
      setCategories(categories);
      console.log(categories);
    };
    const fetchAmount = async () => {
      const response = await getBackendAmountAndDate();
      const amount = response.data.amount;
      const dateRange = response.data.dateRange;
      let [start, end] = dateRange.split(" ");
      setStartDate(start);
      setEndDate(end);
      setAmount(amount.toString());
      console.log(amount);
    };
    fetchAmount();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Form validation
  useEffect(() => {
    const percentageIsValid = () => {
      let total = 0;
      for (let category of categories) {
        total += Number(category.percentage);
      }
      return total === 100;
    };
    const validForm = () => {
      if (categories.length === 0) return false;
      for (let category of categories) {
        if (
          category.category.trim() === "" ||
          category.percentage.toString().trim() === "" ||
          !percentageIsValid() ||
          !validator.isDecimal(amount)
        ) {
          return false;
        }
      }
      return true;
    };
    const formIsValid = validForm();
    setSaveDisabled(!formIsValid);
  }, [categories, amount]);

  const addCategory = () => {
    let updatedCategories = [...categories];
    updatedCategories.push({ category: "", percentage: "" });
    setCategories(updatedCategories);
  };

  const deleteCategory = (index) => {
    let updatedCategories = [...categories];
    deleteBackendCategory(updatedCategories[index].category); // Deleting category from Backend
    updatedCategories.splice(index, 1);
    setCategories(updatedCategories);
  };

  const handleSubmit = (e) => {
    for (let category of categories) saveBackendCategory(category); // Saving category to Backend
    let dateRange =
      format(startDate, "MM/dd/yyyy") + " " + format(endDate, "MM/dd/yyyy");
    saveBackendAmountAndDate(amount, dateRange);
    e.preventDefault();
    setShowForm(false);
  };

  return (
    <header>
      <section>
        {/*<!-- MAIN CONTAINER --> */}
        <div id="container">
          {/*<!-- SHOP NAME --> */}
          <div id="appName">
            <Link to={homeRoute} className="webTitle">
              <b className="pocketText">POCKET</b>
              <span className="planText">PLAN</span>
            </Link>
          </div>
          {/*<!-- COLLECTIONS ON WEBSITE --> */}
          <div id="edit">
            {pathName == "/" ? (
              <Link onClick={() => setShowForm(true)}>
                <BiEditAlt className="editButton" />
              </Link>
            ) : (
              ""
            )}
          </div>
          <div id="notif" onClick={() => setShowDropdown(!showDropdown)}>
            <IoMdNotificationsOutline className="notifButton" />
            {showDropdown && (
              <div className={`dropdown ${showDropdown ? "show" : ""}`}>
                {messages.length > 0 ? (
                  messages.map((item) => (
                    <div key={item.id} className="dropdown-item">
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">No notifications</div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {showForm && (
        <div id="formContainer">
          <div id="formBox">
            <form id="form" onSubmit={handleSubmit}>
              <div id="formDiv">
                <div id="amountDiv">
                  <h4 id="formLabel">Amount:</h4>
                  <input
                    id="formInput"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div id="dateDiv">
                  <h4 id="formLabel">Date:</h4>
                  <DatePicker
                    selected={startDate}
                    onChange={onChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    className="custom-datepicker"
                    wrapperClassName="datepicker-wrapper"
                  />
                </div>
              </div>

              {categories.map((item, index) => (
                <div key={index} id="formDiv">
                  <div id="categoryDiv">
                    <h4>Category:</h4>
                    <input
                      id="formInput"
                      type="text"
                      value={item.category}
                      onChange={(e) => {
                        const updatedCategories = [...categories];
                        updatedCategories[index].category = e.target.value;
                        setCategories(updatedCategories);
                      }}
                    />
                  </div>
                  <div id="percentageDiv">
                    <h4>Percentage:</h4>
                    <input
                      id="formInput"
                      type="text"
                      value={item.percentage}
                      onChange={(e) => {
                        const updatedCategories = [...categories];
                        updatedCategories[index].percentage = e.target.value;
                        setCategories(updatedCategories);
                      }}
                    />
                  </div>
                  <div id="deleteButton">
                    <MdDelete onClick={() => deleteCategory(index)} />
                  </div>
                </div>
              ))}

              <div id="formDiv">
                <RiMenuAddFill id="addIcon" onClick={addCategory} />
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
    </header>
  );
};

export default Header;
