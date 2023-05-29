# package
## backend
yarn add express nodemon prisma cors

## frontend
yarn add @tanstack/react-query

# backend 起動
yarn start
# frontends 起動

yarn start

# prisma studio 起動
npx prisma init --datasource-provider sqlite
npx prisma db push
npx prisma studio