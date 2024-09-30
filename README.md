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
git clone https://github.com/wasswarichard/HTTP-Web-Service-Logging.git
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
```bash
docker-compose up --build
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
- `POST /users/login`: Authenticate a user and return access token.
- `GET /logs`: Returns a list of the logs.
## License
This project uses the following license: [MIT License](<link>).