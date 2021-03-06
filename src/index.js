const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();
process.env.TZ = "Sao Paulo/Brazil";
app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username == username);

  if (!user) {
    return response.status(404).json({ "message": "user not found" });
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ 'error': "user already exists" });
  }

  var user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;

  const { title, deadline } = request.body;

  var todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  var todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ "error": "todo does not found" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  var todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ "error": "todo does not found" });
  }

  todo.done = true;

  return response.status(200).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  var todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ "error": "todo does not found" });
  }

  user.todos.splice(todo, 1);

  return response.status(204).json(user)
});

module.exports = app;