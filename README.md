# [![Purinton Dev](https://purinton.us/logos/brand.png)](https://discord.gg/QSBxQnX7PF)

## @purinton/counting [![npm version](https://img.shields.io/npm/v/@purinton/counting.svg)](https://www.npmjs.com/package/@purinton/counting)[![license](https://img.shields.io/github/license/purinton/counting.svg)](LICENSE)[![build status](https://github.com/purinton/counting/actions/workflows/nodejs.yml/badge.svg)](https://github.com/purinton/counting/actions)

A Discord counting game app. Users count up in sequence in a channel, but cannot count twice in a row. If someone counts out of order or repeats, the count resets. Every 10th number triggers a celebration message. The game state is saved per channel in a database.

---

## Table of Contents

- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Running as a Service (systemd)](#running-as-a-service-systemd)
- [Docker](#docker)
- [How the Counting Game Works](#how-the-counting-game-works)
- [Folder Structure](#folder-structure)
- [Customization](#customization)
  - [Commands](#commands)
  - [Events](#events)
  - [Locales](#locales)
- [Testing](#testing)
- [Support](#support)
- [License](#license)

---

## Features

- Simple counting game: Users type the next number in sequence in a Discord channel.
- Prevents double-counting: No user can count twice in a row.
- Automatic reset: Wrong numbers or double-counting reset the count to 0.
- Celebration messages: Every 10th number triggers a special message.
- Persistent state: Game state is saved in a database per channel.
- Localization: All messages are defined in `locales/en-US.json` (add more locales as needed).
- Discord.js-based app with ESM support
- Command and event handler architecture
- Environment variable support via dotenv
- Logging and signal handling via `@purinton/common`
- Ready for deployment with systemd or Docker
- Jest for testing

---

## Setup Instructions

### 1. Create a Discord Application and app

- Go to the Discord Developer Portal and click "New Application".
- Name your application and save.
- Go to the "app" tab and click "Add Bot".
- Copy the Application (Client) ID and Token—you'll need these for your .env file.
- Under "Privileged Gateway Intents", enable Message Content Intent (required for reading message content).
- Under "OAuth2 > URL Generator", select:
  - Scopes: bot
  - Bot Permissions: Send Messages, Read Message History
- Copy the generated URL and use it to invite the app to your server.

### 2. Clone the repository

```bash
git clone https://github.com/purinton/counting.git
cd counting
```

### 3. Install dependencies

```bash
npm install
```

### 4. Set up the database

This app uses a MySQL/MariaDB database to store the counting state. Import the provided schema:

```bash
# Replace with your DB credentials and database name
mysql -u <db_user> -p <db_name> < schema.sql
```

This creates the `counting_state` table required for the app to function.

### 5. Configure environment variables

Copy `.env.example` to `.env` if it exists, or create a `.env` file. Set your Discord app token, client ID, and database credentials:

```text
DISCORD_TOKEN=your-app-token
DISCORD_CLIENT_ID=your-client-id
LOG_LEVEL=info
DB_HOST=localhost
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=your-db-name
```

### 6. Run the app

```bash
node counting.mjs
```

---

## Running as a Service (systemd)

1. Copy `counting.service` to `/usr/lib/systemd/system/counting.service`.
2. Edit the paths and user/group as needed.
3. Reload systemd and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable counting
sudo systemctl start counting
sudo systemctl status counting
```

---

## Docker

1. Build the Docker image:

   ```bash
   docker build -t counting .
   ```

2. Run the container:

   ```bash
   docker run --env-file .env counting
   ```

---

## How the Counting Game Works

- Type the next number in sequence in the channel.
- You cannot count twice in a row—wait for someone else!
- If you enter the wrong number or count twice, the count resets to 0.
- Every 10th number, a celebration message appears.
- The game state is saved, so you can continue anytime.

All game logic is handled in `events/messageCreate.mjs`.

All user-facing messages are defined in `locales/en-US.json`. You can add more languages by creating additional files in `locales/`.

---

## Folder Structure

```text
events/        # Event handlers (main logic: messageCreate.mjs)
locales/       # Locale JSON files (main: en-US.json)
commands/      # Command definitions and handlers (/help)
schema.sql     # Database schema
.env           # Environment variables (not committed)
```

---

## Customization

### Commands

- Add new commands in the `commands/` directory.
- Each command has a `.json` definition (for Discord registration/localization) and a `.mjs` handler (for logic).

### Events

- Add or modify event handlers in the `events/` directory.
- Each Discord event (e.g., `ready`, `messageCreate`, `interactionCreate`) has its own handler file.

### Locales

- Add or update language files in the `locales/` directory.
- Localize command names, descriptions, and app responses.

## Testing

- Run tests with:

  ```bash
  npm test
  ```

- Add your tests in the `tests/` folder or alongside your code.

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://purinton.us/logos/discord_96.png)](https://discord.gg/QSBxQnX7PF)[![Purinton Dev](https://purinton.us/logos/purinton_96.png)](https://discord.gg/QSBxQnX7PF)

**[Purinton Dev on Discord](https://discord.gg/QSBxQnX7PF)**

## License

[MIT © 2025 Russell Purinton](LICENSE)

## Links

- [GitHub (Project)](https://github.com/purinton/counting)
- [GitHub (Org)](https://github.com/purinton)
- [GitHub (Personal)](https://github.com/rpurinton)
- [Discord](https://discord.gg/QSBxQnX7PF)
