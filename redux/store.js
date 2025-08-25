import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import accountReducer from "./slice/accountSlice";
import billReducer from "./slice/billSlice";
import goalReducer from "./slice/goalSlice";
import expenseReducer from "./slice/expenseSlice";
import transactionReducer from "./slice/transactionSlice"


const store = configureStore({
  reducer: {
    user: userReducer,
    accounts: accountReducer,
    bills: billReducer,
    goals: goalReducer,
    expenses: expenseReducer,
    transactions: transactionReducer,
    
  },
});

export default store;
