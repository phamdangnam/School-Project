/* eslint-disable react/prop-types */
import { PureComponent } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
          console.log(existingTransaction.amount);
        } else {
          acc.push({ ...transaction });
        }
        return acc;
      }, []);
    }

    return (
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          width={500}
          height={300}
          data={combinedTransactions} // Use the combined data
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="amount"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
