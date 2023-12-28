# Wedding Web App Project

View the browser demo at https://herrala-bricker-wedding.onrender.com/demo/

A mobile version will be available soon.

>[!NOTE]
> The entry key for the demo is `porkkalaGala`. If you'd like to demo admin features, please contact me.

## About

I made this web app so that friends and family could listen to music and view/download pictures from my summer 2023 wedding. The demo version, unfortunately, has neither wedding music nor wedding pictures; instead you'll see pictures of trees. 

This was also my project for the University of Helsink's fullstack web development course (https://fullstackopen.com/).

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

### Authentication

### API Routes Authenticated with an Entry Token

### API Routes Authenticated with an Admin Token

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
