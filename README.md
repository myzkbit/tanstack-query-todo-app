# 参考
[TanStack Query(React Query)で作るシンプルToDoアプリでCRUD処理](https://reffect.co.jp/react/tanstack-query)

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