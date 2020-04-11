const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId( request, response, next){
  const { id } = request.params
  if(!isUuid(id)){
    return response.status(400).json({error: "Invalid repository ID."})
  }
  next()
}

const repositories = [
  {
    id: "c77595a4-cfa9-4877-a62d-8a8ec0b1fb1f",
    title: "New Repo",
    url: "newrepo.com",
    techs: [
      "Node",
      "React"
    ],
    likes: 0
  },
  {
    id: "ce4eed7a-b081-4bf8-8ece-2e4b86962a24",
    title: "Outro Repo",
    url: "outrorepo.com",
    techs: [
      "Node",
      "ReactNative"
    ],
    likes: 0
  }
]

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  const newRepository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  }
  repositories.push(newRepository)

  return response.json(newRepository)
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if (repositoryIndex < 0){
    return response.status(404).json({error: "Repository not found."})
  }

  const updatedRepository = {
    ...repositories[repositoryIndex],
    title, 
    url, 
    techs
  }
  repositories[repositoryIndex] = updatedRepository
  return response.json(updatedRepository)
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if (repositoryIndex < 0){
    return response.status(404).json({error: "Repository not found."})
  }

  repositories.splice(repositoryIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  if (repositoryIndex < 0){
    return response.status(404).json({error: "Repository not found."})
  }

  const updatedRepository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1
  }
  repositories[repositoryIndex] = updatedRepository
  return response.json(updatedRepository)
});

module.exports = app;
