# API Guide

>[!IMPORTANT]
>For both default and demo requests, the base URL for the API is https://herrala-bricker-wedding.onrender.com/api
>
>Demo requests must have a `Referer` header than includes `/demo`.

## Requests for User Creation and Log-in

### User Creation: POST `/users`.

If an admin key is provided in the request, it is checked against the admin key stored on the server, and an admin user is created. If no admin key is provided, a non-admin user is created. The bcrypt package is used to create a password hash to be stored on the database. As it's not necessary for ordinary use of the site, user creation is not currently supported on the frontend.

Parameters:
- `username`
    - type: string
    - required: yes
    - unique: yes
    - minLength: 3
- `displayname`
    - type: string
    - required: yes
    - unique: yes
    - minLength: 3
- `password`
    - type: string
    - required: yes
- `email`
    - type: string
    - required: yes
    - unique: yes
- `adminKey`
    - type: string
    - required: no
- `isAdmin`
    - type: boolean
    - required: no
    - default: false
- `isDemo`
    - type: boolean
    - required: no
    - default: false

Returns:
- `username`
- `displayname`
- `email`
- `isDemo`
- `isAdmin`

### User log in: POST `/login`.

Provided passwords are checked against password hashes in the database using bcrypt. 

Parameters:
- `username`
    - type: string
    - required: yes
- `password`
    - type: string
    - required: yes

Returns:
- `username`
- `displayname`
- `isDemo`
- `isAdmin`
- `token`
- `adminToken`
    - `null` for non-admin users

>[!NOTE]
>Site entry is handled as if the user is logging into a user called "entry," with the entry key checked like a password and the entry token provided as the `token` in the returned user object.

## Requests Authenticated with an Entry Token

All requests require `Authorization: Bearer <entryToken>` as a header.

### Entry token verification: POST `/entry-check`

This checks whether the token in the header is a valid entry token for the referer. It's used by the frontend to smoothly exit the browser app when switching between `/` and `/demo`. Otherwise, the user would be left with a shell of the site with no loaded content.

Returns:
- `Status 200` (no response body)

### Audio metadata: GET `/audio-data`

### Image metadata: GET `/image-data`

### Scene data: GET `/scenes`

## Requests Authenticated with an Admin Token

All requests require `Authorization: Bearer <adminToken>` as a header.
