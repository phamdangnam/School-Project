import "../Styling/Footer.css";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../AppProvider";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAllBackendTransactions } from "../API/TransactionService";

const Footer = () => {
  const { amount, categories, startDate, endDate, chatLines, setChatLines } =
    useContext(AppContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [allTransactions, setAllTransactions] = useState();

  const genAI = new GoogleGenerativeAI(
    "AIzaSyDpCjKWQQ4uVfqPfbqI7ac2O5zIqFYTei8"
  );

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generateText = async (prompt) => {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  };

  useEffect(() => {
    const fetchAllTransactions = async () => {
      const response = await getAllBackendTransactions();
      const transactionsWithCategory = response.data;
      setAllTransactions(transactionsWithCategory);
    };
    fetchAllTransactions();
  }, []);

  return (
    <footer>
      <section>
        <div id="containerFooter">
          <div id="webFooter">
            <h3>helpful link</h3>
            <p>home</p>
            <p>about</p>
            <p>contact</p>
          </div>
          <div id="webFooter">
            <h3>partners</h3>
            <p>Goldman Sachs</p>
            <p>BlackRock</p>
            <p>Morgan Stanley</p>
          </div>
          <div id="webFooter">
            <h3>address</h3>
            <p>room 1.355</p>
            <p>ecsw building</p>
            <p>ut dallas</p>
          </div>
        </div>
      </section>

      {/* Chatbox */}
      <div className={`chatbox-container ${isChatOpen ? "open" : ""}`}>
        <div className="chatbox">
          <div
            className="chatbox-header"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <span>Chat Support</span>
            <span className="arrow">{isChatOpen ? "▼" : "▲"}</span>
          </div>
          <div className={`chatbox-body ${isChatOpen ? "show" : ""}`}>
            <div id="chatLine">
              <p>🤖 Hi! How can we help you?</p>
            </div>
            {isChatOpen
              ? chatLines.map((line, index) => (
                  <div key={index} id="chatLine">
                    <p>{`${index % 2 == 0 ? "🙋🏻‍♂️" : "🤖"}: ${line}`}</p>
                  </div>
                ))
              : ""}
          </div>
          <div className={`chatbox-footer ${isChatOpen ? "show" : ""}`}>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              type="text"
              placeholder="Type a message..."
            />
            <button
              onClick={() => {
                generateText(prompt + ". Make it 4-5 sentences.").then(
                  (text) => {
                    let newLines = [...chatLines];
                    newLines.push(prompt);
                    newLines.push(text);
                    setChatLines(newLines);
                    console.log(newLines);
                  }
                );
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
