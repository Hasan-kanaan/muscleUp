import { useAuthContext } from "./useAuthContext";
import { useWorkoutsContext } from "./useWorkoutsContext";

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const { dispatch: workoutsDispatch } = useWorkoutsContext();
    const logout = () => {
        //remove from storage
        localStorage.removeItem("user");
        //dispatch Logout
        dispatch({ type: "LOGOUT" });
        workoutsDispatch({ type: "SET_WORKOUTS", payload: null });
    };
    return { logout };
    };