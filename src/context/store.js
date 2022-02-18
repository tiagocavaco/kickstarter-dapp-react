import React, { createContext, useContext, useEffect, useReducer, useRef, useMemo } from 'react';
import { reducer, initialState, stateToJSON } from '@context/reducer';

export const GlobalContext = createContext();

/**
 * React Context-based Global Store with a reducer
 * and persistent saves to sessionStorage/localStorage
 **/
export const GlobalStore = ({ children }) => {
  const [globalState, dispatch] = useReducer(reducer, initialState);
  const { persistenceType } = globalState;
  const initialRenderGlobalState = useRef(true);
  const initialRenderPersistenceType = useRef(true);

  const contextValue = useMemo(() => {
    return { globalState, dispatch };
  }, [globalState, dispatch]);

  useEffect(() => {
    /*
     the order in which the data is compared is very important;
     first try to populate the state from Storage if not return initialState
    */
    console.log('INIT GLOBAL STATE!');
    if (typeof (Storage) !== 'undefined') {
    } else {
      throw new Error('You need to enable Storage to run this app.');
    }

    const fromLocalStorage = JSON.parse(localStorage.getItem('globalState'));
    const fromSessionStorage = JSON.parse(sessionStorage.getItem('globalState'));

    if (fromSessionStorage || fromLocalStorage) {
      console.log('INIT FROM STORAGE!');
      dispatch({
        type: "SET_GLOBAL_STATE",
        values: fromSessionStorage || fromLocalStorage
      });
    }

    return;
  }, []);

  useEffect(() => {
    /*
     populate either sessionStorage or localStorage
     data from globalState based on persistenceType
    */

    if (initialRenderGlobalState.current) {
      initialRenderGlobalState.current = false;
      return;
    }

    const getPersistenceType = persistenceType;
    if (getPersistenceType === 'sessionStorage') {
      console.log('POPULATE STORAGE!');
      sessionStorage.setItem('globalState', stateToJSON(globalState));
    } else if (getPersistenceType === 'localStorage') {
      localStorage.setItem('globalState', stateToJSON(globalState));
    }
  }, [globalState]);

  useEffect(() => {
    /*
     purge sessionStorage or localStorage when either is selected
    */

    if (initialRenderPersistenceType.current) {
      initialRenderPersistenceType.current = false;
      return;
    }

    const getPersistenceType = globalState.persistenceType;
    if (getPersistenceType === 'sessionStorage') {
      console.log('PURGE STORAGE!');
      sessionStorage.removeItem('globalState');
    } else if (getPersistenceType === 'localStorage') {
      localStorage.removeItem('globalState');
    }
  }, [persistenceType]);

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>;
}

export const useGlobalContext = () => useContext(GlobalContext);