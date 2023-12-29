# Wedding Web App Project

View the browser demo at https://herrala-bricker-wedding.onrender.com/demo/

A mobile version will be available soon.

>[!NOTE]
> The entry key for the demo is `porkkalaGala`. If you'd like to demo admin features, feel free to contact me for demo admin credentials.

## About

I made this web app so that friends and family could listen to music and view/download pictures from my summer 2023 wedding. The demo version, I'm sorry to say, has neither wedding music nor wedding pictures; instead you'll see pictures of trees alongside music inspired by trees. 

This was also my project for the University of Helsinki's fullstack web development course (https://fullstackopen.com/). The information contained in this ReadMe is largely reflective of that.

The Basics
- Frontend: React
- Backend: NodeJS
- Mobile App: React Native (+ Expo)
- Database: MongoDB

## Frontend

## Backend

### Default vs. Demo Routing

>[!IMPORTANT]
>In this project, "default" denotes any item (e.g., entry key, token, secret, metadatum, media file, etc.) that is only available through the main `/` path. "Default" is synonomous with "non-demo", with "demo" and "default" taken to be exclusive.
>
>For example, an endpoint, in this sense, won't be "default," since the same routes handle traffic from both `/` and `/demo`. However, the requests sent to these endpoints, and the responses returned by them, will be either "default" or "demo," since both vary systematically based on referer.

The demo version of the app is structurally identical to the default version. While actual wedding content is unavailable when demoing, `/` and `/demo` return the same frontend build to the browser, and the same mobile app (with all the same components) handles both default and demo use. Additionally, default and demo requests are handled using the same routes and authenticated using the same middleware; default and demo media files are stored in the same directories on the server; and default and demo data are stored in the same collections in the same MongoDB database. This approach allows the demo view to match the default as closely as possible, all while requiring minimal extra code. The alternative, creating seperate frontend builds and/or seperate backend routes, would have been cumbersome to implement and a burden to maintain.

To accomplish this minimal default-demo strategy, default and demo requests are differentiated based on the `Referer` header. For traffic from the browser, this requires no additional steps as the default and demo pages are provided at different URLs. In the mobile app, `/demo` is added to `Referer` when the app is put into "demo mode." Entry middleware on the server then sorts requests into default and demo, assigning the property `isDemo=true` for requests that include `/demo` in the `Referer` header, and `isDemo=false` for all other requests. As every entry in the database has the attribute `isDemo`, queries to the database then select for either only default or demo data. Admin requests that add new entries to the database will assign `isDemo` based on whether the user is authenticated as a default or demo admin.

### Authentication

This project uses the jsonwebtoken package to authenticate requests using bearer tokens. 

Three levels of authentication are currently supported.
1. Entry authentication: When users provide a valid entry key, the server returns an **entry token.** This authenticates GET requests for audio and image files, scenes, and audio and image metadata.
2. User authentication: When a user logs in with a valid password, the server returns a **user token**. This is not presently used to authenticate any requests, but has been built into the architecture of the site to allow for possible expansion to user-specific views or operations.
3. Admin authentication: When an admin user logs in with a valid password, the server returns an **admin token** in addition to a user token. This admin token authenticates requests to create and delete scenes, upload and delete media, as well as link/unlink images with scenes.

>[!NOTE]
>Default and demo tokens are signed using different secrets, and cannot be used to authenticate the other's requests. A demo entry token, for example, cannot be used to authenticate a request for default image metadata.

### API

### Static Media Files

## Database

## Mobile App

## Testing

### Backend Integration Testing

### End-to-end Testing

## CI/CD

## Production Schematic

```mermaid
%%{ init: { 'flowchart': { 'curve': 'basis'} } }%%
flowchart LR
    subgraph Browser
        A(.../)
        B(.../demo)
    end
    subgraph Server on Render
        subgraph RenderEnv
            C(Secrets)
            X(Config)
        end
        subgraph NodeJS Backend
            D(Static FE build)
            E(Entry middleware)
            F(Static authentication middleware)
            subgraph Endpoints
                G(/api/entry-check)
                H(/api/users)
                I(/api/login)
                J(/api/audio-data)
                K(/api/image-data)
                L(/api/scenes)
                M(/api/admin/upload)
                N(/api/images)
                O(/api/audio)
            end
        end
        subgraph DiskStorage
            AA(Audio files)
            AB(Image files)
        end
    end
    subgraph MongoDB
        subgraph AudioData
            BA(isDemo=true)
            BB(isDemo=false)
        end
        subgraph ImageData
            CA(isDemo=true)
            CB(isDemo=false)
        end
        subgraph Scenes
            DA(isDemo=true)
            DB(isDemo=false)
        end
        subgraph Users
            EA(isDemo=true)
            EB(isDemo=false)
        end
    end
    Browser -.- D
    A --> |/|E
    B --> |/demo|E
    E ==> |isDemo=true|Endpoints
    E ==> |isDemo=false|Endpoints
    E --> |isDemo=true|F
    E --> |isDemo=false|F
    C -.- Endpoints
    H <--> Users
    I <--> Users
    J <--> AudioData
    K <--> ImageData
    L <--> Scenes
    Browser === |/|Endpoints
    Browser === |/demo|Endpoints
    M --> DiskStorage
    M --> ImageData & AudioData
    F --> N & O <--> DiskStorage
    linkStyle 1,4,6,13 stroke:#CFFFFE,stroke-width:2px;
    linkStyle 2,3,5,14 stroke:#2B8988,stroke-width:2px;
    linkStyle 8,9 stroke:#3F7CA8,stroke-width:2px;
    linkStyle 10,11 stroke:#33678B,stroke-width:2px;
    linkStyle 12 stroke:#8C6934,stroke-width:2px;
    linkStyle 15,16,17 stroke:#3DAA72,stroke-width:2px;
    linkStyle 18,19,20,21 stroke:#AB3E58,stroke-width:2px;
```
