import "../Styling/Header.css";
import { homeRoute } from "../Data/routes";
import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { RiMenuAddFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { AppContext } from "../AppProvider.jsx";
import validator from "validator";
import {
  saveBackendCategory,
  deleteBackendCategory,
  getBackendCategories,
} from "../API/CategoryService.js";
import { saveBackendAmount, getBackendAmount } from "../API/AmountService.js";
const Header = () => {
  const [showForm, setShowForm] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);

  const { categories, amount, setCategories, setAmount } =
    useContext(AppContext);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getBackendCategories();
      const categories = response.data;
      setCategories(categories);
      console.log(categories);
    };
    const fetchAmount = async () => {
      const response = await getBackendAmount();
      const amount = response.data;
      setAmount(amount.toString());
      console.log(amount);
    };
    fetchAmount();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    saveBackendAmount(amount);
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
            <Link onClick={() => setShowForm(true)}>
              <BiEditAlt className="editButton" />
            </Link>
          </div>
        </div>
      </section>
      {showForm && (
        <div id="formContainer">
          <div id="formBox">
            <form id="form" onSubmit={handleSubmit}>
              <div id="formDiv">
                <h3 id="formLabel">Amount:</h3>
                <input
                  id="totalInput"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
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
