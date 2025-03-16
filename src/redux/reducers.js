// src/redux/reducers.js
import { ActionTypes } from './actions';

const initialState = {
  lists: [],
  loading: false,
  error: null,
  selectedLists: []
};

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.FETCH_LISTS_START:
      return { ...state, loading: true, error: null };
      
    case ActionTypes.FETCH_LISTS_SUCCESS:
      return { ...state, loading: false, lists: action.payload };
      
    case ActionTypes.FETCH_LISTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
      
    case ActionTypes.SET_SELECTED_LISTS:
      return { ...state, selectedLists: action.payload };
      
    case ActionTypes.UPDATE_LISTS:
      return { ...state, lists: action.payload };
      
    default:
      return state;
  }
};