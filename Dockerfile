#chỉ định base image
FROM --platform=linux/amd64 node:24.9.0-alpine AS BUILD

#chỉ định thư mục hoạt động mặc định /app
WORKDIR /app

#copy package.json and package-lock.json
COPY package*.json .

#install dependencies
RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

FROM --platform=linux/amd64 node:24.9.0-alpine AS PRODUCTION

WORKDIR /app

COPY --from=BUILD ./app/dist ./dist
COPY --from=BUILD ./app/node_modules ./node_modules

#chỉ định lệnh chạy khi container khởi động
CMD ["node", "dist/src/main"]

#run chỉ chạy khi build image
#cmd chạy khi container khởi động

