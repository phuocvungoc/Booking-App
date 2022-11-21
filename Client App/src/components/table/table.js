import React from "react";
import "./table.css";

const Tables = (props) => {
  const renderTableData = () => {
    return props.data.map((transaction, index) => {
      return (
        <tr key={transaction._id}>
          <td>{index + 1}</td>
          <td>{transaction.hotel}</td>
          <td>{transaction.rooms.join(", ")}</td>
          <td>{transaction.date}</td>
          <td>{transaction.totalPrice}</td>
          <td>{transaction.payment}</td>
          <td>
            <button className={transaction.status}>{transaction.status}</button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="tContainer">
      <table className="customers">
        <tr>
          <th>#</th>
          <th>Hotel</th>
          <th>Room</th>
          <th>Date</th>
          <th>Price</th>
          <th>Payment Method</th>
          <th>Status</th>
        </tr>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
};

export default Tables;
