# Socket Chat

A deployable server backend which can be used for real time communication to android (and other mobile).

Example use cases:
1. Notification service
2. Live chat app

## How to run

All you need is mongodb instance. Steps:
1. Create a typescript file in `typeSrc` folder named `secrets.ts`.  `touch typeSrc/secrets.ts`
2. Extend the Secrets class and define properties (username, password).

OR::  Just insert mongoUrl in `index.ts`.

Start the server `npm run start`.

You will need to register and create your own token. (Steps to be added later)

### This project is typescript port of the previous project which grew out of hand: [Socket Notif](https://github.com/zeerorg/Socket-Notif)

**Under development. The older project is working (if steps given their are followed correctly).**

**NOTE: typescript type declarations are broken so you need to manually fix them. Example, type declaration of "mongodb/collection => count" function**