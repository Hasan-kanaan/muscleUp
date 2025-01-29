import { useAuthContext } from "./useAuthContext";
export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const logout = () => {
        //remove from storage
        localStorage.removeItem("user");
        //dispatch Logout
        dispatch({ type: "LOGOUT" });
    };
    return { logout };
    };