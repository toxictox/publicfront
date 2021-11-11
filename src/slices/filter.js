import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  path: "",
  page: 0,
  params: {},
};

const slice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterParams(state, action) {
      state.path = action.payload.path;
      state.params = action.payload.params;
    },

    setFilterPage(state, action) {
      state.path = action.payload.path;
      state.page = action.payload.page;
    },
  },
});

export const { reducer } = slice;

export const setFilterParams = (data) => async (dispatch) => {
  dispatch(slice.actions.setFilterParams(data));
};

export const setFilterPage = (data) => async (dispatch) => {
  dispatch(slice.actions.setFilterPage(data));
};

export default slice;
