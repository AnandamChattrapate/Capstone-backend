### backend development
1.  create git repo
2.  add .gitignore
3.  Create .env files
4. generate package.json
5. install express
6. install mongoose
7. add middlewares(body parser,error handling,middleware)
8. Design Schemas and Create models (User,Author,Admin)
9. Design REST APIs for ALL resources
10. registration and login in common
11. client wont send role

### User Register
POST http://localhost:4000/user-api/users
Content-Type: application/json

{
  "firstName": "Anurag",
  "lastName": "Sharma",
  "email": "anurag.user@example.com",
  "password": "User@12345",
  "profileImageUrl": "https://example.com/avatars/user.png"
}

### User Login
POST http://localhost:4000/user-api/authenticate
Content-Type: application/json

{
  "email": "anurag.user@example.com",
  "password": "User@12345",
  "role":"USER"
}

### Author Register
POST http://localhost:4000/author-api/users
Content-Type: application/json

{
  "firstName": "Vikas",
  "lastName": "Author",
  "email": "vikas.author@example.com",
  "password": "Author@12345",
  "profileImageUrl": "https://example.com/avatars/author.png"
}


### Author Register
POST http://localhost:4000/author-api/users
Content-Type: application/json

{
  "firstName": "test",
  "lastName": "Author",
  "email": "test.author@example.com",
  "password": "testauthor",
  "profileImageUrl": "https://example.com/avatars/author.png"
}

### Author Login
POST http://localhost:4000/author-api/authenticate
Content-Type: application/json

{
  "email": "vikas.author@example.com",
  "password": "Author@12345",
  "role":"AUTHOR"
}



### Create article (AUTHOR)
POST http://localhost:4000/author-api/articles
Content-Type: application/json

{
  "author":"6989799b7013502767d3f82b",
  "title":"test2 article",
  "category":"programming",
  "content":"content of test2 article"
}



###Read articles of a author
GET http://localhost:4000/author-api/articles/698965b85a08a6721a29ef61



### Update article (AUTHOR)
PUT http://localhost:4000/author-api/articles
Content-Type: application/json

{
  "author":"6989799b7013502767d3f82b",
  "articleId":"698981d2b54ba14743e2e94a",
  "title":"test2 article updated",
  "category":"programming",
  "content":"content of test2 article updated"
}



### Logout
POST http://localhost:4000/logout