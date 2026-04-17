import { createSlice } from "@reduxjs/toolkit";

const productSlice=createSlice({
    name:'product',
    initialState:{
        sellerProducts:[],
        allProducts:[],
        loading:false,
        error:null,
    },
    reducers:{
        setSellerProducts:(state,action)=>{
            state.sellerProducts=action.payload;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload;
        },
        setAllProducts:(state,action)=>{
            state.allProducts=action.payload;
        },
        setError:(state,action)=>{
            state.error=action.payload;
        },
    }
});
export const {setSellerProducts,setLoading,setAllProducts,setError}=productSlice.actions;
export default productSlice.reducer;