#################################################
# Dockerfile for running microservice			#
#################################################


FROM node:14.2.0-alpine3.11

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building code for development
# RUN npm install

# If you are building your code for production
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8000

# Some Node.js libraries and frameworks will only enable production-related optimization if they detect that the NODE_ENV env var set to production
ENV NODE_ENV production


ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init

USER node
COPY --chown=node:node . /usr/src/app

CMD ["dumb-init", "npm", "start" ]