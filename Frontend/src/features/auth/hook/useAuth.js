import { useDispatch } from "react-redux";
import { getMe, login, register } from "../service/auth.api.js";
import { setUser,setLoading,setError } from "../state/auth.slice.js";
import { data } from "react-router";


export const useAuth = () => {
    
    const dispatch=useDispatch();
    async function handleRegister({email,contact,password,fullname,isSeller=false}) {
        try {
            dispatch(setLoading(true));
            const response = await register({email,contact,password,fullname,isSeller});
            dispatch(setUser(response.user));
            return response.user;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleLogin({email,password}) {
        try {
            dispatch(setLoading(true));
            const response = await login({email,password});
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
    return {handleRegister,handleLogin,handleGetMe};
}