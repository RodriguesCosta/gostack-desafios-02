const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body

  const repository = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  }

  repositories.push(repository)

  response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { url, title, techs } = request.body

  if (!isUuid(id)) {
    response.status(400).json({ error: 'ID not uuid' })
  }

  const projecIndex = repositories.findIndex(project => project.id === id)

  if (projecIndex < 0) {
    response.status(400).json({ error: 'ID not found' })
  }

  const repository = {
    id,
    url,
    title,
    techs,
    likes: repositories[projecIndex].likes,
  }

  repositories[projecIndex] = repository

  response.json(repository)
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params

  if (!isUuid(id)) {
    res.status(400).json({ error: 'ID not uuid' })
  }

  const projecIndex = repositories.findIndex(project => project.id === id)

  if (projecIndex < 0) {
    res.status(400).json({ error: 'ID not found' })
  }

  repositories.splice(projecIndex, 1)

  res.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  if (!isUuid(id)) {
    response.status(400).json({ error: 'ID not uuid' })
  }

  const projecIndex = repositories.findIndex(project => project.id === id)

  if (projecIndex < 0) {
    response.status(400).json({ error: 'ID not found' })
  }

  repositories[projecIndex].likes++

  response.json(repositories[projecIndex])
});

module.exports = app;
