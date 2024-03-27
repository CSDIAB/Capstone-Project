import { useState, useEffect } from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import Users from './Users';
import Businesses from './Businesses';
import CreateReview from './CreateReview';
import Home from './Home';
import BusinessReview from './BusinessReviews';
import UserReviews from './UserReviews';


function App() {
  const [auth, setAuth] = useState({});
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);
 
  useEffect(()=> {
    fetch("/api/users").then(res => res.json()).then(json => {
      setUsers(json);
    }).catch(ex => console.log("error", ex))
    fetch("/api/businesses").then(res => res.json()).then(json => {
      console.log(json);
      setBusinesses(json);
    }).catch(ex => console.log("error", ex))
  }, []);

  

  const attemptLoginWithToken = async()=> {
    const token = window.localStorage.getItem('token');
    if(token){
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token
        }
      });
      const json = await response.json();
      if(response.ok){
        setAuth(json);
      }
      else {
        window.localStorage.removeItem('token');
      }
    }
  };

const deleteReview = async(id, userId) => {
  
  try { const token = window.localStorage.getItem('token');
   const response = await fetch(`/api/users/${userId}/reviews/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', authorization: token
      }

    });
    
    const json = await response.json();
    console.log(json);
    
 }
 catch(er){
   console.log(er)
   
 }
  }


  const authAction = async(credentials, mode)=> {
    const response = await fetch(`/api/auth/${mode}`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if(response.ok){
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
    }
    else {
      throw json;
    }
  };

  const logout = ()=> {
    window.localStorage.removeItem('token');
    setAuth({});
  };

  return (
    <>
      <h1>Acme Business Reviews</h1>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/businesses'>Businesses ({ businesses.length })</Link>
        <Link to='/users'>Users ({ users.length })</Link>
        {
          auth.id ? <Link to='/createReview'>Create Review</Link> : <Link to='/'>Register/Login</Link>
        }
     </nav>
    {
      auth.id && <button onClick={ logout }>Logout { auth.username }</button>
    }
      <Routes>
        <Route path='/' element={
          <Home
            authAction = { authAction }
            auth = { auth }
            businesses = { businesses }
            users = { users }
            reviews = { reviews }
          />
        } />
        <Route path='/businesses' element={<Businesses businesses={ businesses } />} />
        <Route path = "/businesses/:id" element = {<BusinessReview auth = {auth} deleteReview = {deleteReview}/>}/>
        <Route path = "/users/:id" element = {<UserReviews auth = {auth} deleteReview = {deleteReview}/>}/>
        <Route path='/users' element={<Users users={ users}/>} />
        {
          !!auth.id && <Route path='/createReview' element={<CreateReview businesses = {businesses} />} />
        }
      </Routes>
    </>
  )
}

export default App
