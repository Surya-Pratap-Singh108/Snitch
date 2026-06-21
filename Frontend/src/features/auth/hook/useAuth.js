import { useDispatch } from "react-redux";
import { getMe, login, logout, register } from "../service/auth.api.js";
import { setUser, setLoading, setError } from "../state/auth.slice.js";


export const useAuth = () => {

    const dispatch = useDispatch();
    async function handleRegister({ email, contact, password, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true));
            const response = await register({ email, contact, password, fullname, isSeller });
            return response;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"));
            return null;
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            const response = await login({ email, password });
            dispatch(setUser(response.user));
            return response.user;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const response = await getMe();
            dispatch(setUser(response.user));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleLogout() {
    try {
        await logout();
        dispatch(setUser(null));
    } catch (error) {
        console.error(error);
    }
}
    return { handleRegister, handleLogin, handleGetMe,handleLogout  };
}