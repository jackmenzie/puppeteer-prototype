# puppeteer-prototype

## Project Overview

This project is designed to scrape the odds for a specified horse race utilising Puppeteer. The application exposes an API endpoint (`/odds`), which when authenticated and authorized, allows a user to retrieve the odds for the upcoming horse race. The backend server is built using Fastify and the testing framework is tap.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)

## Installation

1. Clone the repository:

```sh
git clone https://github.com/jackmenzie/puppeteer-prototype
cd puppeteer-prototype
```

2. Install dependencies (pnpm used):

```sh
pnpm install
```

3. Start the server locally:

```sh
pnpm run dev
```

## Usage

Once the server is running, the following can be done to retrieve the results for the provided horse race:

1. Make a GET request to the authentication endpoint to retrieve a JWT token
2. Attach the JWT token to an authorization header
3. Find an upcoming horse race URL from the Betano horse racing [website](https://www.betano.co.uk/en-gb/sports/364)
4. Make a POST request with the authorization header attached and a body message similar to below:

```
{
    url: "https://www.betano.co.uk/en-gb/sports/364/meetings/73279998/events/2253484300"
}
```
