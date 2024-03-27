# Description

- this is a working application which allows users to login and to register

# Tier One Features to Add

## authenticated and non authenticated users

- a user should be able to view all the businesses
  - each business should have a name
- a user should be able to see the other users
- a review should have both a user_id and a _business_id_ as well as:
  - a comment
  - a rating which is an integer from 1 to 5
- a user should be able to see the reviews made by a selected user with a link to /users/:id which they can be accessed from the users listing
- a user should be able to see the reviews of a selected business with a link to /businesses/:id which can be accessed from the businesses listing

## authenticated users

- a loggedin user should be able to create a review for a business
- a loggedin user should be able to remove a view which they created
- the wireframes provide a visual representation of the functionality which is described

<a href='https://github.com/FullstackAcademy/acme-business-reviews/blob/main/acme_reviews.png'>Wireframe</a>

# Optional Features to Add

- a user should be able to edit their reviews
- a business should have an image_url which can be shown on it's detail page
- a user should have an a boolean property which allows them to opt into and out of notifications
- a user can favorite businesses and see the businesses which they favorited
- a user can be an administrator
- an administrator can add, edit, and delete businesses

# Setup

- create database

```
createdb fsa_app_db
```

- install dependencies

```
npm install && cd client && npm install
```

- start server in root directory of repository

```
npm run start:dev
```

- start vite server in client directory

```
npm run dev
```

- use a username and password in server/index.js in order to test out application.

# to test deployment

```
cd client && npm run build
```

browse to localhost:3000 (or whatever server port you used)

# to deploy

- build script for deploy

```
npm install && cd client && npm install && npm run build

```

- start script for deploy

```
node server/index.js

```

- environment variables for deployed site

```
JWT for jwt secret
DATABASE_URL for postgres database
```
