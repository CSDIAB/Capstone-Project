const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://postgres:Chris5600@localhost/fsa_app_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
if(JWT === 'shhh'){
  console.log('If deployed, set process.env.JWT to something other than shhh');
}

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS businesses;
    
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE businesses(
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
    CREATE TABLE reviews (
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users NOT NULL,
      business_id UUID REFERENCES businesses NOT NULL,
      comment TEXT NOT NULL,
      rating INTEGER NOT NULL
    );
  `;
  await client.query(SQL);
};

const createBusiness = async(name)=> {
  if(!name){
    const error = Error('business name required');
    error.status = 401;
    throw error;
  }
  const SQL = `
    INSERT INTO businesses(id, name) VALUES($1, $2) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name ]);
  return response.rows[0];
};

const createUser = async({ username, password})=> {
  if(!username || !password){
    const error = Error('username and password required!');
    error.status = 401;
    throw error;
  }
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
  return response.rows[0];
};

const createReview = async({userId, businessId, comment, rating})=> {
  if(!comment || !rating){
    const error = Error('please comment and rate');
    error.status = 401;
    throw error;
  }
  const SQL = `
    INSERT INTO reviews(id, user_id, business_id, comment, rating)  VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), userId, businessId, comment, rating ]);
  return response.rows[0];
};

const destroyReview = async({userId, reviewId})=> {
  if(!userId || !reviewId){
    const error = Error('invalid user id and review id');
    error.status = 404;
    throw error;
  }
  const SQL = `
    DELETE FROM reviews WHERE user_id = $1 AND id = $2; 
  `;
  const response = await client.query(SQL, [userId, reviewId]);
  return {message: "deleted review"};
};
// the point of this code is to have a deletereview function in my db - now I have to eventually export/import and 
// go into my index.js file where I will utilize what I just wrote. 



const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT id, username, password FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token };
};

const findUserWithToken = async(token)=> {
  let id;
  try{
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  }
  catch(ex){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async()=> {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchBusinesses = async()=> {
  const SQL = `
    SELECT id, name FROM businesses;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReviews = async()=> {
  const SQL = `
    SELECT id, user_id, business_id, comment, rating FROM reviews;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchUserbyId = async (id) =>{
  console.log(id);
  const SQL = `
  SELECT id, username FROM users WHERE id = $1;
  `
  const response = await client.query(SQL, [id]);
  console.log('DATA', response.rows);
  return response.rows[0]; 
}
 

const fetchBusinessbyId = async (id) => {
  //do i need the WHERE id = 1 in my SQL
  console.log(id)
  const SQL = `
  SELECT id, name FROM businesses WHERE id = $1;
  `
  const response = await client.query(SQL, [id]);
  console.log('DATA', response.rows);
  return response.rows; 
}
 


const fetchReviewbyBusinessId = async (id) => {
  console.log(id)
  const SQL = `
    SELECT * FROM reviews WHERE business_id = $1;
  `;
  const response = await client.query(SQL, [id]);
  console.log('DATA', response.rows);
  return response.rows; 
}

const fetchReviewbyUserId = async (id) => {
  console.log(id)
  const SQL = `
    SELECT * FROM reviews WHERE user_id = $1;
  `;
  const response = await client.query(SQL, [id]);
  console.log('DATA', response.rows);
  return response.rows; 
}


module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  authenticate,
  findUserWithToken,
  fetchBusinesses,
  createBusiness,
  fetchReviews,
  createReview,
  fetchReviewbyBusinessId,
  fetchReviewbyUserId,
  fetchUserbyId,
  fetchBusinessbyId,
  destroyReview
};
