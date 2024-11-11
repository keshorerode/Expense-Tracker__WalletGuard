import React from "react";
import "./styles.css";
import { Card, Row } from "antd";
import Button from "../Button";

function Cards({ income,
  expense,
  totalBalance,
  showExpenseModal ={showExpenseModal},
  showIncomeModal  ={showIncomeModal}  })

{
        return(
           <div>
            <Row className="my-row">
            
      <Card bordered={true} className="my-card">
        <h2>Current Balance</h2>
        <p>₹{totalBalance}</p>
       <Button text="Reset Balance" blue={true}/>
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Income</h2>
        <p>₹{income}</p>
        <Button text="Add Income" blue={true} onclick={showIncomeModal}/>
      </Card>

      <Card bordered={true} className="my-card">
        <h2>Total Expenses</h2>
        <p>₹{expense}</p>
        <Button text="Add Expense" blue={true} onclick={showExpenseModal}/>
      </Card>

            </Row>
            
           </div>
        );
}

export default Cards;
