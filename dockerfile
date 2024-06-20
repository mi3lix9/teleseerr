FROM node:lts

# Install basic development tools
RUN apt update && apt install -y less man-db sudo

# Ensure default `node` user has access to `sudo`
ARG USERNAME=node
RUN echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
  && chmod 0440 /etc/sudoers.d/$USERNAME

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy application code
COPY . .

RUN mkdir -p /app/config

# Set up volume for config, logs, and database
VOLUME ["/app/config"]

# Install dependencies using pnpm
RUN pnpm install

# Start the application
CMD ["pnpm", "start"]
