FROM oven/bun:1.1.8-debian

# Config Bun
ENV PATH="~/.bun/bin:${PATH}"
RUN ln -s /usr/local/bin/bun /usr/local/bin/node


# Set working directory
WORKDIR /app

# Copy application code
COPY . .

RUN mkdir -p /app/config

# Set up volume for config, logs, and database
VOLUME ["/app/config"]

# Install dependencies
RUN bun install --production

# Build the application
# RUN bun run push
RUN bun run build
# Expose port (adjust if necessary)
# EXPOSE 3000

# Start the application
CMD ["bun", "start"]
