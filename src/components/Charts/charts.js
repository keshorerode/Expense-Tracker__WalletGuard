import React, { useMemo } from "react";
import { Line, Pie } from '@ant-design/charts';
import './charts.css'; // Ensure you have this CSS file for styles

function ChartsComponent({ sortedTransactions }) {
    // Prepare the data for the Line chart
    const data = useMemo(() => 
        sortedTransactions.map((item) => ({
            date: item.date, // Ensure this is formatted as 'YYYY-MM-DD'
            amount: item.amount,
        })),
        [sortedTransactions]
    );

    // Prepare the data for the Pie chart
    const spendingData = useMemo(() => 
        sortedTransactions
            .filter(transaction => transaction.type === "expense")
            .map(transaction => ({
                tag: transaction.tag,
                amount: transaction.amount,
            })),
        [sortedTransactions]
    );

    if (sortedTransactions.length === 0) {
        return <div>No transactions available.</div>;
    }

    const lineConfig = {
        data,
        autoFit: true,
        xField: 'date',
        yField: 'amount',
        xAxis: {
            type: 'timeCat',
            tickCount: 5,
            label: {
                autoHide: false,
                autoRotate: false,
                style: {
                    textAlign: 'center',
                },
            },
        },
        yAxis: {
            title: {
                text: 'Amount',
            },
        },
        smooth: true,
        point: {
            size: 4,
        },
    };

    const pieConfig = {
        data: spendingData,
        angleField: "amount",
        colorField: "tag",
        autoFit: true,
    };

    return (
        <div className="charts-wrapper">
            <div className="line-chart">
                <h1>Your Analytics</h1>
                <Line {...lineConfig} />
            </div>
            <div className="pie-chart">
                <h1>Your Spendings</h1>
                <Pie {...pieConfig} />
            </div>
        </div>
    );
}

export default ChartsComponent;
