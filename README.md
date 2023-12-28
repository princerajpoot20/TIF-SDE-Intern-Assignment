# Update as of now:
- Implemented all the endpoints mentioned in the assignment.
- I am working on the `Brownie Points` , I am not able to complete these `Brownie Points` within these 3 days because I am on **vacation (Christmas and New Year vacation).**


# How to run it locally
- Clone this repo
- Execute these command: `npm install` and `npm start`



## API Endpoints

This document lists all the API endpoints for the SaaS platform.

## Role Module

- **Create Role**
  - **URL:** `POST /v1/role`
- **Get All Roles**
  - **URL:** `GET /v1/role`

## User Module

- **User Sign Up**
  - **URL:** `POST /v1/auth/signup`
- **User Sign In**
  - **URL:** `POST /v1/auth/signin`
- **Get User Information**
  - **URL:** `GET /v1/auth/me`

## Community Module

- **Create Community**
  - **URL:** `POST /v1/community`
- **Get All Communities**
  - **URL:** `GET /v1/community`
- **Get All Members of a Community**
  - **URL:** `GET /v1/community/:id/members`
- **Get Communities Owned by User**
  - **URL:** `GET /v1/community/me/owner`
- **Get Communities Joined by User**
  - **URL:** `GET /v1/community/me/member`

## Member Module

- **Add Member to Community**
  - **URL:** `POST /v1/member`
- **Remove Member from Community**
  - **URL:** `DELETE /v1/member/:id`
