const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const port = 3001;

app.use(cors())
app.use(express.json());

const prisma = new PrismaClient();
app.get('/todos', async (req, res) => {
  const todos = await prisma.todo.findMany();
  return res.json(todos);
});

app.post('/todos/create', async (req, res) => {
  const { name } = req.body;
  const todo = await prisma.todo.create({
    data: {
      name,
      isCompleted: false,
    },
  });
  return res.json(todo);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));