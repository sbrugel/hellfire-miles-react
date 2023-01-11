# Hellfire Miles: React Edition
A web application that supplements Mike Wright's Hellfire 3 that displays in-game moves and mileages based on .CSV data. It also shows various statistics of that game data. Users are able to create accounts on the app, and can upload their game CSV data to the site, which gets stored in a database, associated with that user.

## Note
This is not necessarily a replacement for the [C# version](https://github.com/sbrugel/HellfireMiles), as I don't plan on deploying this version due to how basic it is. It's just an attempt at tackling a previous project idea of mine in a completely different context.

## Demo Video
[Available here](https://youtu.be/pgRBD5Ft85I)

## Features
### Login
A ***very basic*** register & login system is implemented. Accounts (i.e. username, email, and password) get saved to the database on registration and users can login to these accounts, letting them access their data and statistics.

It's pretty crappy, but it's my first, go easy on me.

Some things to note:
- You will get logged out every time you refresh the page (i.e. hit F5, Ctrl+R, etc.). Navigating pages normally shouldn't make this happen though.
- It's not a secure system - will need to look into implementing tokens and stuff at some point
- It just doesn't *look* all that good

### Uploading & Viewing Moves
In Hellfire, you can export "moves" from a gameplay session, which earlier were referred to as "game data". They are saved in CSV format. You can upload these CSVs to the site and each move will be stored in the database, associated with your account. You can view the moves associated with your account at any time by going to the home page:

![im](https://i.imgur.com/dmqOEjT.png)

You can also filter these moves by a specific locomotive or class (clicking a locomotive number on the first column will automatically filter by that loco):

![im](https://i.imgur.com/aFT1ZAS.png)

![im](https://i.imgur.com/hijOoUC.png)

### Traction League
The traction league page shows overall class data based on every CSV you have uploaded. It sums up mileage, number of journeys, and percentage cleared. 

![im](https://i.imgur.com/SyYhCfg.png)

### Class Stats
Clicking on a class in the Traction League will bring you to the Class Stats page for that locomotive class, which shows every locomotive and the number of miles/journeys you have accumulated:

![im](https://i.imgur.com/MpNVJqu.png)

Clicking on a locomotive number will filter the main page by that locomotive.

## How to deploy (locally)
### Setting up the DB
Assuming you already have a MongoDB organization set up, you will need to create a project to hold the user/moves data.

1. On your org page, click `New Project`.
2. Follow the instructions to set up the project. (Includes naming and setting access)
3. Create a new Cluster once you are done with that. You only require the Free tier, Shared cluster for this to work.
4. Once you reach the Authentication setup page, choose to auth via `User and Password`. Create a username and password; **make sure you have this info saved somewhere, you will need it for your connection string.**
5. For the `Where would you like to connect from?` section, keep this set to `My local environment`. On the below IP addresses list, just add `0.0.0.0`.
6. You'll now need a connection string. Once on the main page of the project (pictured below), click `Connect`.

   ![img](https://i.imgur.com/4yadsew.png)

7. Select `Connect your application`; you will then see a connection string just below step 2. Copy this somewhere where you can shortly find it again; **make sure you add in your password!**

That's the database part done. Now to setup the config:

### Setting up the server
1. Open up a terminal of your choosing.
2. Navigate to the `server` folder within the project.
3. Run `npm i`; this will install all required dependencies to run this part of the program.
4. Copy the `config-template.env` file, rename the clone to `config.env`. Replace the `ATLAS_URI` field with the aforementioned connection string. Keep the `PORT` field unchanged.

To run the script, just enter `node server.js` and keep the terminal open.

### Setting up the client
1. Open up another terminal of your choosing.
2. Navigate to the `client` folder within the project.
3. Run `npm i`; this will install all required dependencies to run this part of the program. (This may take a while.)

Run `npm start` and keep the terminal open. The page will be accessible locally (normally at `http://localhost:3000`).