# Web Service

## Libraries/Frameworks used

- **Backend** : Nestjs, TypeScript, Sequelize, Jest, SuperTest, Postgres

## Design decisions
### Backend
- API Design : The API is implemented [Nestjs](https://nestjs.com/). It supports offset-limit based pagination for the list of candidates.
- Testing : All the Rest operations are tested using integration test cases using Jest and SuperTest.
- Linting & Formatting : The codebase is linted using ESLint and formatted using Prettier.
- Deployment : The Nestjs nodejs server can be dockerized and deployed in container orchestration platforms like Kubernetes or AWS EKS, ECS or Fargate.
- Logging & Monitoring : The application logs and metrics stored in postgres database. The logs are subscribed too using nestjs Event Emitter library.

## To run locally

Clone the repository
```bash
git clone https://github.com/wasswarichard/Web-Service-Logging.git
```
cd into the repository
```bash
cd HTTP-Web-Service-Logging
```
create a .env file and update the environment variables
```bash
DATABASE_HOST=postgres // this is the container database host
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
JWT_SECRET=
```
Inside the repository run
#### option 1
```bash
docker-compose up --build
```
#### option 2
```bash
npm install
npm run start
```

The Backend server will start on
```bash
http://localhost:3000
```

## Test cases snapshot

Backend:

![Snapshot of backend cases](./docs/e2e_testcases.png)

## API Endpoints

The application exposes the following endpoints:

- `POST /users/register`: Register a new user.
#### Request
```bash
{
    "email": "johndoe@gmail.com",
    "password": "test1234567",
    "role": "ADMIN" //optional enum value (ADMIN, USER)
}
```
#### Response
```bash
{
    "message": "User registered successfully",
    "userId": 5
}
```
- `POST /users/login`: Authenticate a user and return access token.
#### Request
```bash
{
    "email": "johndoe@gmail.com",
    "password": "test1234567",

}
```
#### Response 
```bash
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwic3ViIjo0LCJpYXQiOjE3Mjc2OTQ1ODh9.c4n0TX77zAj2Svohy3RRho9rEnTzlYKzRzz__YQeEQM"
}
```
- `GET /logs`: Returns a list of the logs.
#### Response
```bash
{
    "infoCount": 11,
    "warningCount": 0,
    "errorCount": 0,
    "messageWithUrlCount": 0
}
 ```