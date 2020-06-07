# :fire: Pop Up :fire:

[Hack the Northeast](https://htne.devpost.com/) submission. Interactive AR business cards.

## :computer: Prerequisites

To run all the components of our project you'll need the following:

- [Node.js and npm](https://nodejs.org/en/)
- [Git](https://git-scm.com/), to clone this repository
- [Cordova cli](https://cordova.apache.org/)

## :rocket: To get started

First, clone the git repository:

```bash
$ git clone https://github.com/dreamInCoDeforlife/HNorthEastern.git
```

Then, `cd` into the repository:

```bash
$ cd HNorthEastern
```

### :astonished: For the AR website

`cd` into the AR website folder:

```bash
$ cd website/public
```

Serve the files using whatever you prefer to view the website.<br>
Example with php:

```bash
$ php -S localhost:3000
```

### :earth_americas: For the mobile app

`cd` into the mobile app folder:

```bash
$ cd QRCodeCard
```

Install the necessary libraries using `npm`

```bash
$ npm install
```

Run the app with cordova to view it in the browser

```bash
$ cordova run browser
```

### :robot: For the api

`cd` into the api folder:

```bash
$ cd QRCodeCard
```

Install the necessary libraries using `npm`

```bash
$ npm install
```

Rename `example.env` to `.env.local` and replace `XXX` values with your own.<br>

Start the development server

```bash
$ npm run dev
```

## :scream: Don't want to set up the project yourself?

View the finished project here:

- AR website: [https://pop-up-ar.web.app](https://pop-up-ar.web.app)
- QR code mobile app: [https://qrcodes-app.web.app](https://qrcodes-app.web.app)
