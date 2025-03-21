/* eslint-disable react/prop-types */
import { PureComponent } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts";

export default class MyChart extends PureComponent {
  render() {
    let transactions = this.props.data;

    // Combine transactions by date
    let combinedTransactions = [];
    if (transactions.length !== 0) {
      combinedTransactions = transactions.reduce((acc, transaction) => {
        const existingTransaction = acc.find(
          (item) => item.date === transaction.date
        );
        if (existingTransaction) {
          existingTransaction.amount =
            Number(existingTransaction.amount) + Number(transaction.amount);
        } else {
          acc.push({ ...transaction });
        }
        return acc;
      }, []);
    }
    // Sort dates from earliest to latest
    combinedTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <ResponsiveContainer width="100%" height="80%">
        <ComposedChart width={730} height={250} data={combinedTransactions}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#f5f5f5" />
          <Bar dataKey="amount" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="amount" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
