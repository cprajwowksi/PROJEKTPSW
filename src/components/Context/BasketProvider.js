import React, { createContext, useReducer, useContext, useEffect } from 'react';

const BasketContext = createContext();

// Define your reducer function
const basketReducer = (state, action) => {
    switch (action.type) {
        case 'SET_BASKET':
            return { ...state, basket: action.payload };
        case 'ADD_TO_BASKET':
            return { ...state, basket: [...state.basket, action.payload]}
        case 'DELETE_FROM_BASKET':
            return { ...state, basket: state.basket.filter(x => x !== action.payload)}
        default:
            return state;
    }
};

const BasketProvider = ({ children }) => {
    // Use useReducer instead of useState
    const [state, dispatch] = useReducer(basketReducer, { basket: [] });

    const setBasketContext = (userData) => {
        // Dispatch the action to set the basket
        dispatch({ type: 'SET_BASKET', payload: userData });
    };
    const addBasketContext = (userData) => {
        // Dispatch the action to set the basket
        dispatch({ type: 'ADD_TO_BASKET', payload: userData });
    };
    const deleteBasketContext = (userData) => {
        // Dispatch the action to set the basket
        dispatch({ type: 'DELETE_FROM_BASKET', payload: userData });
    };
    return (
        <BasketContext.Provider value={{ basket: state.basket, setBasketContext , addBasketContext, deleteBasketContext}}>
            {children}
        </BasketContext.Provider>
    );
};

const useBasketContext = () => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error('useBasketContext musi być używane wewnątrz BasketProvider');
    }
    return context;
};

export { BasketProvider, useBasketContext };
