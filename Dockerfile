FROM node:latest

# Copy source
COPY . .

# Install deps
RUN npm i

# Build dist
RUN npm run build

# Expose port 3000
EXPOSE 3000

CMD npm run start