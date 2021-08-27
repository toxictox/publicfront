import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  okCallback: undefined,
  text: "",
  title: "",
  isOpen: false,
};

const slice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    showConfirm(state, action) {
      state.isOpen = action.payload.isOpen;
      state.text = action.payload.text;
      state.title = action.payload.title;
      state.okCallback = action.payload.okCallback;
    },
  },
});

export const { reducer } = slice;

export const showConfirm = (props) => async (dispatch) => {
  dispatch(slice.actions.showConfirm(props));
};

export default slice;
