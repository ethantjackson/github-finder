import { useReducer, useEffect } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
  SEARCH_USERS,
  CLEAR_USERS,
  SET_LOADING,
  GET_USER,
  GET_REPOS,
} from '../types';

const GithubState = (props) => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false,
  };

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      const res = await axios.get(
        `https://api.github.com/users?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=&${process.env.REACT_APP_CLIENT_SECRET}`
      );
      dispatch({ type: SEARCH_USERS, payload: res.data });
      return res;
    }

    fetchData();
    // eslint-disable-next-line
  }, []);

  const [state, dispatch] = useReducer(GithubReducer, initialState);
  //search users
  const searchUsers = async (text) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=&${process.env.REACT_APP_CLIENT_SECRET}`
    );

    dispatch({ type: SEARCH_USERS, payload: res.data.items });
  };

  //set loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  //clear users
  const clearUsers = () => {
    dispatch({ type: CLEAR_USERS });
  };

  //get user
  const getUser = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=&${process.env.REACT_APP_CLIENT_SECRET}`
    );
    dispatch({ type: GET_USER, payload: res.data });
  };

  //get repos
  const getUserRepos = async (username) => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=&${process.env.REACT_APP_CLIENT_SECRET}`
    );
    dispatch({ type: GET_REPOS, payload: res.data });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        clearUsers,
        searchUsers,
        getUser,
        getUserRepos,
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
