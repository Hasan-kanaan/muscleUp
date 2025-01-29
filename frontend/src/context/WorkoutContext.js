import { createContext, useReducer } from "react";

export const WorkoutsContext = createContext();

export const workoutsReducer = (state, action) => {
  switch (action.type) {
    case "SET_WORKOUTS":
      return {
        workouts: action.payload,
      };
    case "CREATE_WORKOUT":
      return {
        ...state,
        workouts: {
          workouts: [action.payload, ...state.workouts.workouts],
          pagination: {
            ...state.workouts.pagination,
            totalItems: state.workouts.pagination.totalItems + 1,
          },
        },
      };

    case "DELETE_WORKOUT":
      return {
        ...state,
        workouts: {
          workouts: state.workouts.workouts.filter(
            (workout) => workout._id !== action.payload
          ),
          pagination: {
            ...state.workouts.pagination,
            totalItems: state.workouts.pagination.totalItems - 1,
          },
        },
      };
    default:
      return state;
  }
};

export const WorkoutsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workoutsReducer, {
    workouts: null,
  });

  return (
    <WorkoutsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutsContext.Provider>
  );
};
