import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext, useState } from "react";
import MainLayout from "./Pages/MainLayout";
import ItemLayout from "./Pages/ItemLayout";
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

function AppProvider() {
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  return (
    <AppContext.Provider
      value={{
        amount,
        setAmount,
        categories,
        setCategories,
        messages,
        setMessages,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />} />{" "}
          <Route path="/contentDetails/:id" element={<ItemLayout />} />{" "}
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}

export default AppProvider;
