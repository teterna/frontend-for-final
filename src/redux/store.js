import { createStore } from 'redux';

const initialState = {
  user: null,
  users: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(user => user.id !== action.payload) };
    case 'UPDATE_USER_ROLE':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? { ...user, role: action.payload.role } : user
        )
      };
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
