# Daily Diet API 🍽

This project is a complete **REST API in Node.js** to register of meals and controlling of a daily diet. The project is a challenge of Node.js trail of Ignite - bootcamp of specialization in programing of [**Rocketseat**](https://github.com/rocketseat-education). The entire application was developed based on the **functional requirements** and **business rules** listed below.

## Functional requirements

- It should be able to create a user
- It should be able to register a meal
- It should be able to list all meals of a user
- It should be able to get a specific meal
- It should be able to edit a meal
- It should be able to delete a meal
- It should be able to get metrics of a user

## Business rules

- It should be able to identify the user between requests
- Meals must be related to a user
- The user only views, edits and deletes the meals created by him
- Every meal can be on the diet or not

## More about the project 👀

### Description

This API does not have authentication, so the creation of a user was done with a **cookie**, that is, when the user registers your first meal, an ID is generated and returned in response to the request. Thus, this cookie will be automatically on all other requests, making it possible to identify and link all actions of a user. Thus, the user only visualizes and manipulates the meals registered by him, as well as recover your metrics, that is, the total of registered meals, the total of inside diet meals and off diet meals, also the best sequence per day of meals inside of diet.

### Routing and project base

The base for this API was the **Fastify** for application route management, together with **Zod** for the validation, transforming and type definition of entries data to each route (parameters and request body). Also, was used **TypeScript** for provide best development experience and ficilitate the maintenance process, together with **ES Lint** to define patterns for writing code.

### Database

The database solution used in development was **SQLite**, already in production was used **PostgreSQL**. Also, **Knex** query builder is used to facilitate the swap of database client without need make big changes in code, together of use migrations to controlling version of database schema.

### Automated tests

In this application was developed tests on type **E2E** (end-to-end), using tools as **Vitest** and **SuperTest**. The choice of Vitest was based mainly in performance, since he use esbuild, also native support to the TypeScript and the big resemblance of functionalities with Jest.

### Deploy

The deploy of application was made using the free plan of platform **Render**. Inside of platform the PostgreSQL database and Web Service were created, connecting with the repository of GitHub to automate the process. Also, the tool **TSUP** helped in build process of application, being more performative by too use the esbuild.

## All tools and technologies 🧰

- TypeScript
- Node.js
- Fastify
- Knex
- DotEnv
- Zod
- Vitest
- SuperTest
- TSUP
- TSX
- ES Lint
- SQLite
- PostgreSQL

##

**#NeverStopLearning 🚀**
