This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### .env
copy the .env.docker to .env file and change the DATABASE_URL to have instead of host "db", "localhost" if you plan to run the db container separately and the app from the IDE.

### Install

```bash
npm install # to install the dependencies
npx prisma generate # to generate the prisma client
npx prisma db push # to create the db schema
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.


## DB Updates
After updating the schema.prima, run:
```bash
npx prisma db push
```
  
For initial data run:

```bash
npx prisma db seed
```

## Structure:

In the root we have the Dockerfile and docker-compose to start the environment and database. If you run from the IDE the app, you can start only the container for the DB.

We also have the next.config.js and tailwind.config.js files. for configuration of the app.

### /prisma
Here we have the prisma orm configuration and the schema.prima file. Also the seed.ts file with initial test data for the db.

### /public
For logos, fonts etc

### /src
The main source code

#### /src/components
Common components to be used in the app. 
Under /layout you can find components for the core layout of the app.
Under /ui you can find components for the UI of the app.

#### /src/lib
Here we have the prisma client to be used in the app. Also the next-auth configuration, and some other utils and configs

#### /src/services
Here we have the services for the app. For example clients for the apis.

#### /src/types
Here we have common types for the app.

### /src/middleware.ts
Here we have the middleware for the app. For example the authentication middleware for redirects.

#### /src/app
We use the app router. Here is the main code.
Under /api we have the api routes.

