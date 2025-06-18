FROM node

WORKDIR /app

COPY package*.json /app
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start"]
