<p align="center">
  <img src="./assets/logo.png" alt="Logo" width="120">
</p>

<h1 align="center">Acme-Unpuchero</h1>

A next-generation API (or something like that) for a next-generation restaruant management system (or something like that).

<details>
  <summary>Spoiler warning</summary>
  
  This is a technical assessment for the role of Senior Backend Developer at Tailor. It is a RESTful API built with NestJS and TypeScript. This is not next-generation nothing, this is not real, don't use it for anything 🫶.
</details>

<p align="center">
<a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="Built with NestJS" /></a>
<a href="https://pnpm.io/" target="_blank"><img src="https://img.shields.io/badge/pnpm-yellow?style=for-the-badge&logo=pnpm&logoColor=white" alt="Built with PNPM" /></a>
<a href="https://swagger.io/" target="_blank"><img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" alt="Built with Swagger" /></a>
</p>
<p align="center">
<a href="https://app.codecov.io/gh/alesanmed-forked-projects/senior-backend-challenge" >
<img alt="Codecov" src="https://img.shields.io/codecov/c/github/alesanmed-forked-projects/senior-backend-challenge?style=for-the-badge"
height="30"/>
</a>
<img src="./assets/built-with-sabrosura.svg" alt="Built with Forthebadge" height="30"/>
</p>
<p align="center">
<a href="https://app.codecov.io/gh/alesanmed-forked-projects/senior-backend-challenge"><img alt="Codecov" src="https://codecov.io/gh/alesanmed-forked-projects/senior-backend-challenge/graphs/sunburst.svg?token=4ANXHYI4S5" height="240"/></a>
</p>

## How to use the app?

This app is deployed in the following URL: https://acme-un-puchero.alesanmed.com

You can test the app using the following credentials:

- Email: admin@example.com
- Password: The one set by default in swagger login request.

The password is the same for every user. The availabe user emails are:

- steve@example.com
- morgan@example.com
- jason@example.com
- steph@example.com
- sam@example.com
- zs@example.com
- emily@example.com
- allen@example.com
- david@example.com
- raymond@example.com
- laurel@example.com

## How is this app built?

This project is a RESTful API built with NestJS and TypeScript. The architecture is based on [Hexagonal Architecture](<https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)>). A general overview is shown in the following diagram:

<p align="center">
  <img src="./assets/Architecture.svg" alt="Architecture" height="400"/>
</p>

The user makes an http request to the endpoint. After that, some validations are performe using the DTO. The final object is passed to the controller. The controller calls the necessary usecases to perform the action required by the endpoint.

The information needed by the usecase is passed using queries and command objects (just containing information, no logic). The usecase performs (if needed) some business logic and then calls the repository.

Finally, the response is returned to the user.

Throughout this process, the data is transformed between the different layers using mappers.

### Modules and their responsibilities

The project is divided into the following modules:

- Auth: Handles the authentication and authorization of the users.
- Users: Handles the users and their favorites.
- Restaurants: Handles the restaurants of the system.
- Reviews: Handles the reviews of the system.
- Dashboard: Handles the statistics of the system.

Each module has its own repository, usecases, controllers, and DTOs.

## What are the app components?

The app doesn't have a lot of moving parts, but there a few important ones:

- The database: A SQLite database is used to store the app data.
- The cache: A Redis cache is used to store the GET endpoint responses.
- The authentication: JWT is used to authenticate the users.
- The authorization: Role-based access control is used to authorize the users.
- The logging: Pino is used to log the events of the app.

## How to run the app?

To run the app, you need to have pnpm installed and node 24 installed.

You then have to copy the .env.example file to .env and change the values if needed.

Then, you can run the app using the following command:

```bash
pnpm install
pnpm start:dev
```

The app will be available at http://localhost:3000.

If you chose a different, port, you can access the app at http://localhost:PORT.

## How to run the tests?

To run the tests, you need to have pnpm installed. Then, you can run the following command:

```bash
pnpm test:cov
```

## How to build and deploy the app?

The app is ready to be deployed using docker. You can build the image using the following command:

```bash
docker build -t acme-un-puchero .
```

You can then run the container using the following command:

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e NODE_ENV=production \
  -e DATABASE_PATH=./restaurants.db \
  -e JWT_SECRET=supersecret \
  -e JWT_EXPIRES_IN_SECONDS=3600 \
  -e REDIS_CACHE_URL=redis://localhost:6379 \
  acme-un-puchero
```

If you want to run the app using docker compose, a docker-compose.yaml file is provided. You can use it to run the app using the following command:

```bash
docker compose up -d
```

The app will be available at http://localhost:3000.

If you want to stop the app, you can use the following command:

```bash
docker compose down
```
