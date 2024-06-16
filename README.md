# Teleserr: Telegram Bot for Jellyseerr Integration

Teleserr is a Telegram bot designed to integrate with Jellyseerr, allowing you to search and request your media directly through Telegram. It's a convenient way to manage your media library on-the-go.

## Features

- 🔍 Search Media: Easily search for media using Telegram.
- 📥 Request Media: Request media to be added to your Jellyseerr library.
- ⚙️ Easy Setup: Quick and simple setup with Docker.

## Installation

### Docker Compose

```yml
services:
  teleseerr:
    image: ghcr.io/mi3lix9/teleseerr
    container_name: teleseerr
    environment:
      - BOT_TOKEN=botusername@123456789
      - JELLYSEERR_URL="http://localhost:5055"
      - JELLYSEERR_KEY="YOUR KEY"
    volumes:
      - /path/to/config:/config
    restart: unless-stopped
```

### Docker Command

```sh
docker run -d \
  --name teleseerr \
  -e BOT_TOKEN=botusername@123456789 \
  -e JELLYSEERR_URL="http://localhost:5055" \
  -e JELLYSEERR_KEY="YOUR KEY" \
  -v /path/to/config:/config \
  --restart unless-stopped \
  ghcr.io/mi3lix9/teleseerr
```

## Development Stage

Teleserr is still in its early development stages, meaning you can expect frequent updates and changes as we refine and expand its capabilities. We love open-source projects and believe in the power of community collaboration. This project is open source, and we warmly welcome contributions from developers and enthusiasts. Whether you have ideas for new features, improvements, or bug fixes, your input and support are highly valued. Join us in making Teleserr better by contributing to our codebase or providing feedback! 🚀✨
