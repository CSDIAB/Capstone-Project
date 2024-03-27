import {
  Link
 } from "react-router-dom"



const Users = ({ users })=> {
  //console.log(users);
  return (
    <>
    <h1>Placeholder for Users { users.length }</h1>
    {
     users.map(user => <Link to = {`/users/${user.id}`}>{user.username}</Link>)   
    }
    </>
  );
}


export default Users;
