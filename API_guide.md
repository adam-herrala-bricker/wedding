# API Guide

>[!IMPORTANT]
>For both default and demo requests, the base URL for the API is https://herrala-bricker-wedding.onrender.com/api
>
>Demo requests must have a `Referer` header that includes `/demo`.

## Requests for User Creation and Log-in

### POST `/users`.

Creates a new user.

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

### POST `/login`.

Logs users in.

Provided passwords (or entry keys) are checked against password hashes in the database using bcrypt. 

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

### POST `/entry-check`

Streamlines entry token verification.

This checks whether the token in the header is a valid entry token for the referer. It's used by the frontend to smoothly exit the browser app when switching between `/` and `/demo`. Otherwise, the user would be left with a shell of the site with no loaded content and lots of `400` responses.

Parameters:
- `none`

Returns:
- `Status 200` (no response body)

### GET `/audio-data`

Fetches the metadata for all audio files (either default or demo).

Returns:
- array of `audio` objects

>[!NOTE]
>`audio` objects are structured `{fileName: string, isDemo: boolean, id: string}`

### GET `/image-data`

Fetches the metadata for all image files (either default or demo).

Parameters:
- `none`

Returns:
- array of `image` objects

>[!NOTE]
>`image` objects are structured `{fileName: string, scenes: [scene], people: [], isDemo: boolean, id: string}`

Each `scene` object in `scenes` is a scene linked to that image. Returned scenes are populated with `sceneName` and are structured `{sceneName: string, id: string}`

`people` is a placeholder for a possible future feature, tagging people in photos. It is not presently used by the frontend.

### GET `/scenes`

Fetches all scenes (either default or demo).

Parameters:
- `none`

Returns:
- array of `scene` objects

>[!NOTE]
>`scene` objects are structured `{sceneName: string, images: [string], isDemo: boolean, id: string}`

`images` is a vestige of an earlier version of scene linking, where the id of every images was added to the scenes it was linked to. This no longer happens, and `scene.images` is not used by the frontend, but the old linked image ids remain.

## Requests Authenticated with an Admin Token

All requests require `Authorization: Bearer <adminToken>` as a header.

### POST `/admin/upload/audio`

Uploads an audio file.

The audio file is saved to disk storage on the server, and audio metadata is added to the database, with `isDemo` assigned dynamically based on referer.

Parameters:
- `FormData` object with `'adminUpload'` as the key and the audio file as the value

Returns:
- `audio` object

### POST `/admin/upload/images`

Uploads an image file.

The image file is saved to disk storage on the server, and image metadata is added to the database. The id for `scene-0` (the _all/kaikki_ scene) is added to image metadata by default, and `isDemo` assigned dynamically based on referer.

Parameters:
- `FormData` object with `'adminUpload'` as the key and the image file as the value

Returns:
- `image` object

### DELETE `/audio/:id`

Delete the audio file with the given `id`.

If metadata for an audio file with `id` is found in the database, that entry is removed from the database, and the audio file itself is deleted from the server.

Parameters:
- `none`

Returns:
- `Status 204` (no response body)
