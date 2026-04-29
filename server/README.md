# Server

Simple Express + Mongo server for auth endpoints.

Setup:

1. cd server
2. copy .env.example to .env and set `MONGO_URI` if needed
3. npm install
4. npm run dev

The server listens on port 5000 by default and exposes `/api/auth/register` for registration.
