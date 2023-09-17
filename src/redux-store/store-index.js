import { configureStore } from "@reduxjs/toolkit";

import listReducer from "./list-slice";

const ReduxStore = configureStore({
    reducer: {eventListStore: listReducer}
});

export default ReduxStore;