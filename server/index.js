


const {
  client,
  createTables,
  createUser,
  fetchUsers,
  authenticate,
  findUserWithToken,
  fetchBusinesses,
  createBusiness,
  createReview,
  fetchReviews,
  fetchReviewbyBusinessId,
  fetchReviewbyUserId,
  fetchUserbyId,
  fetchBusinessbyId,
  destroyReview
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

//for deployment only
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets'))); 

const isLoggedIn = async(req, res, next)=> {
  try{
    console.log(req.headers.authorization)
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  }
  catch(ex){
    next(ex);
  }
};

// create post route to /api/reviews
app.post('/api/reviews', isLoggedIn, async(req, res, next)=> {
  try {
    console.log(req.user)
    res.send(await createReview({...req.body, userId: req.user.id}));
  }
  catch(ex){
    next(ex);
  }
  
});
// add try catch block to handler with req res next
// add isLoggedIn to the route as middleware (before async)

app.post('/api/auth/login', async(req, res, next)=> {
  try {
    res.send(await authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/reviews', async(req, res, next)=> {
  try {
    //use the next line after adding middleware, AFTER COMMA isLoggedIn,  
    //console.log(req.user)
    //console.log(req.user.id)
    res.send({message: 'request received'});
  }

  catch(ex){
    next(ex);
  }
});

//create the form, text area, drop down with numbers for rating, tricky part
// is getting the businesses, in use effect fetch all the businesses, then you 
// display the business name option tag is business id. 

app.post('/api/auth/register', async(req, res, next)=> {
  try {
    const user = await createUser(req.body);
    res.send(await authenticate(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await fetchUsers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/reviews/:businessId', async(req, res, next) => {
  try {
    console.log('inside the business id route')
    const review = await fetchReviewbyBusinessId(req.params.businessId);
    const users = await fetchUsers();
    const usermap = {};
    users.forEach(user => usermap[user.id] = user.username);
    const payload = [];
    review.forEach(item => {
      payload.push({
          ...item, name: usermap[item.user_id] 
      })
    })
    
    res.send(payload);
  }
  catch(ex){
    next(ex);
  }
});
app.get('/api/reviews/user/:userId', async(req, res, next) => {
  try {
    console.log('inside the user id route')
    const review = await fetchReviewbyUserId(req.params.userId);
    const businesses = await fetchBusinesses();
    const businessmap = {};
    businesses.forEach(business => businessmap[business.id] = business.name);
    console.log(businessmap)
    const payload = [];
    review.forEach(item => {
      payload.push({
        ...item, name: businessmap[item.business_id] 
      })
    })
    
    res.send(payload);
    
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/users/:userId/reviews/:id', async(req, res, next) => {
  try {
    console.log('inside the delete route')
    await destroyReview({userId:req.params.userId, reviewId:req.params.id});
    
    res.send({message: 'deleted'});
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/businesses', async(req, res, next)=> {
  try {
    res.send(await fetchBusinesses());
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});

const init = async()=> {
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');

  const [moe, lucy, ethyl, curly] = await Promise.all([
    createUser({ username: 'moe', password: 'm_pw'}),
    createUser({ username: 'lucy', password: 'l_pw'}),
    createUser({ username: 'ethyl', password: 'e_pw'}),
    createUser({ username: 'curly', password: 'c_pw'})
  ]);

  console.log(await fetchUsers());

  const [A, B, C, D] = await Promise.all([
    createBusiness(  "A"),
    createBusiness( 'B'),
    createBusiness(  'C'),
    createBusiness(  'D')
  ]);

  const [review1, review2, review3, review4] = await Promise.all([
    createReview({userId: moe.id, businessId: A.id, comment: "not good", rating:2 }),
    createReview({ userId: curly.id, businessId: B.id, comment: " good", rating:5 }),
    createReview({ userId: ethyl.id, businessId: C.id, comment: "kinda good", rating:3}),
    createReview({userId: lucy.id, businessId: D.id, comment: "terrible", rating:1})
  ]);

  console.log(await fetchBusinesses());
  console.log(await fetchReviews());
  // fetchReviewbyBusinessId(A.id);
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();

