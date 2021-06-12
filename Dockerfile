FROM node:latest

# Copy source
COPY . .

# Install deps
RUN npm i

# Build dist
RUN npm run build


# Run
CMD npm run start