FROM node:10

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
RUN npm install -g nodemon babel-cli babel-preset-env
COPY . .
EXPOSE 3000
CMD ["yarn", "dev-deploy"]
