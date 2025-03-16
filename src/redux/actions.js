// src/redux/actions.js
export const ActionTypes = {
    FETCH_LISTS_START: 'FETCH_LISTS_START',
    FETCH_LISTS_SUCCESS: 'FETCH_LISTS_SUCCESS',
    FETCH_LISTS_FAILURE: 'FETCH_LISTS_FAILURE',
    SET_SELECTED_LISTS: 'SET_SELECTED_LISTS',
    UPDATE_LISTS: 'UPDATE_LISTS',
  };
  
  export const fetchListsStart = () => ({ type: ActionTypes.FETCH_LISTS_START });
  export const fetchListsSuccess = (lists) => ({ 
    type: ActionTypes.FETCH_LISTS_SUCCESS,
    payload: lists 
  });
  export const fetchListsFailure = (error) => ({ 
    type: ActionTypes.FETCH_LISTS_FAILURE,
    payload: error 
  });
  
  export const setSelectedLists = (lists) => ({
    type: ActionTypes.SET_SELECTED_LISTS,
    payload: lists
  });
  
  export const updateLists = (updatedLists) => ({
    type: ActionTypes.UPDATE_LISTS,
    payload: updatedLists
  });
  
  export const fetchLists = () => async (dispatch) => {
    const API_URL = 'https://apis.ccbp.in/list-creation/lists';
    try {
      dispatch(fetchListsStart());
      const response = await fetch(API_URL);
      
      if (!response.ok) throw new Error(`Failed to fetch lists. Status: ${response.status}`);
      
      const data = await response.json();
      const formattedLists = [
        {
          list_number: 1,
          items: data.lists.filter((_, i) => i % 2 === 0).map(item => ({
            id: item.id,
            name: item.name,
            description: item.description
          }))
        },
        {
          list_number: 2,
          items: data.lists.filter((_, i) => i % 2 === 1).map(item => ({
            id: item.id,
            name: item.name,
            description: item.description
          }))
        }
      ];
      dispatch(fetchListsSuccess(formattedLists));
    } catch (error) {
      dispatch(fetchListsFailure(error.message));
    }
  };