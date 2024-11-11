import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards/cards';
import Chartscomponent from '../components/Charts/charts';
import NoTransactions from '../components/TransactionsTable/Notransactions';
import { Modal } from 'antd';
import AddExpenseModals from '../components/Modal/addExpense';
import AddIncomeModals from '../components/Modal/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import TransactionsTable from '../components/TransactionsTable';

function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user] = useAuthState(auth);
    const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
    const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [totalBalance, SetTotalBalance] = useState(0);
    const [negativeBalanceModalVisible, setNegativeBalanceModalVisible] = useState(false);

    const showExpenseModal = () => setIsExpenseModalVisible(true);
    const showIncomeModal = () => setIsIncomeModalVisible(true);
    const handleExpenseCancel = () => setIsExpenseModalVisible(false);
    const handleIncomeCancel = () => setIsIncomeModalVisible(false);

    const onFinish = (values, type) => {
        const newTransaction = {
            type: type,
            date: values.date.format("YYYY-MM-DD"),
            amount: parseFloat(values.amount),
            tag: values.tag,
            name: values.name,
        };
        addTransaction(newTransaction);
    };

    async function addTransaction(transaction) {
        try {
            if (transaction.type === 'expense' && transaction.amount > totalBalance) {
                // Prevent adding expense if balance would become negative
                toast.error("Insufficient balance to add this expense!");
                return;  // Exit the function without adding the transaction
            }

            const docRef = await addDoc(
                collection(db, `users/${user.uid}/transactions`),
                transaction
            );
            toast.success("Transaction Added!");
            setTransactions([...transactions, transaction]);
            calculateBalance([...transactions, transaction]);
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Couldn't add transaction");
        }
    }

    async function fetchTransactions() {
        setLoading(true);
        if (user) {
            try {
                const q = query(collection(db, `users/${user.uid}/transactions`));
                const querySnapshot = await getDocs(q);
                const transactionsArray = querySnapshot.docs.map(doc => doc.data());
                setTransactions(transactionsArray);
                calculateBalance(transactionsArray);
                toast.success("Transactions Fetched!");
            } catch (error) {
                console.error("Error fetching transactions:", error);
                toast.error("Failed to fetch transactions");
            }
        }
        setLoading(false);
    }

    const calculateBalance = (transactionsArray) => {
        let incomeTotal = 0;
        let expensesTotal = 0;

        transactionsArray.forEach((transaction) => {
            if (transaction.type === "income") incomeTotal += transaction.amount;
            else if (transaction.type === "expense") expensesTotal += transaction.amount;
        });

        setIncome(incomeTotal);
        setExpense(expensesTotal);
        const newBalance = incomeTotal - expensesTotal;
        SetTotalBalance(newBalance);

        // If balance is negative, show modal
        if (newBalance < 0) {
            setNegativeBalanceModalVisible(true);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user]);

    return (
        <div>
            <Header />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Cards 
                        income={income}
                        expense={expense}
                        totalBalance={totalBalance}
                        showExpenseModal={showExpenseModal}
                        showIncomeModal={showIncomeModal}
                    />
                    {transactions.length ? (
                        <Chartscomponent sortedTransactions={transactions} />
                    ) : (
                        <NoTransactions />
                    )}
                    <AddExpenseModals
                        isExpenseModalVisible={isExpenseModalVisible}
                        handleExpenseCancel={handleExpenseCancel}
                        onFinish={onFinish}
                    />
                    <AddIncomeModals
                        isIncomeModalVisible={isIncomeModalVisible}
                        handleIncomeCancel={handleIncomeCancel}
                        onFinish={onFinish}
                    />
                    <TransactionsTable 
                        transactions={transactions} 
                        addTransaction={addTransaction}
                        fetchTransactions={fetchTransactions}
                    />
                </>
            )}

            {/* Negative Balance Warning Modal */}
            <Modal
                title="Negative Balance Warning"
                visible={negativeBalanceModalVisible}
                onOk={() => setNegativeBalanceModalVisible(false)}
                onCancel={() => setNegativeBalanceModalVisible(false)}
            >
                <p>Your balance is negative. Please review your transactions.</p>
            </Modal>
        </div>
    );
}

export default Dashboard;
