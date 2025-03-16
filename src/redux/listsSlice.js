import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL = 'https://apis.ccbp.in/list-creation/lists';

export const fetchLists = createAsyncThunk(
  'lists/fetchLists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Server error! Status: ' + response.status);
      const data = await response.json();
      return data.lists;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const listsSlice = createSlice({
  name: 'lists',
  initialState: {
    items: [],
    selected: [],
    status: 'idle',
    error: null
  },
  reducers: {
    setSelectedLists: (state, action) => {
      state.selected = action.payload;
    },
    updateLists: (state, action) => {
      state.items = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLists.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        const allItems = action.payload;
        state.items = [
          {
            list_number: 1,
            items: allItems.filter((_, i) => i % 2 === 0).map(item => ({
              id: item.id,
              name: item.name,
              description: item.description
            }))
          },
          {
            list_number: 2,
            items: allItems.filter((_, i) => i % 2 === 1).map(item => ({
              id: item.id,
              name: item.name,
              description: item.description
            }))
          }
        ];
        state.status = 'succeeded';
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch lists';
      });
  }
});

export const { setSelectedLists, updateLists, resetError } = listsSlice.actions;
export default listsSlice.reducer;