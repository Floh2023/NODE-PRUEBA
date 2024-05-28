const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemna/movies')
const cors = require('cors')
const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACEPTED_ORIGINS = [
      'http://localhost:12348',
      'http://localhost:12349',
      'http://localhost:60745'
    ]
    if (ACEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.get('/movies', (req, res) => {
  //const origin = req.header('origin')
  //if (ACEPTED_ORIGINS.includes(origin) || !origin) {
  //  res.header('Acces-Control-Allow-Origin', origin)
  //}
  //res.header('Access-Control-Allow-Origin', '*')
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

//app.get('/movies/:id/:mas/:otro', (req, res) => {
//  const {id, mas, otro} = req.params
//})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (!result.success) {
    return res.status(404).json({ error: JSON.parse(result.error.message) })
  }

  //if (!title || !genre || !year || !director || !duration) {
  //  return res.status(400).json({ message: 'Missing required fields'})
  //}
  //if (typeof duration !== 'number') {
  //  return res.status(400).json({ message: 'Duration is not a number' })
  //}

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  //  no es rest porque guardo el estado de la app en memoria
  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(404).json({ error: JSON.parse(result.error.message) })
  }
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }
  movies.splice(movieIndex, 1)
  return res.json({ message: 'Movie deleted' })
})
//app.options('/movies', (req, res) => {
//  const origin = req.header('origin')
//  if (ACEPTED_ORIGINS.include(origin) || !origin) {
//    res.header('Access-Control-Allow-Origin', origin)
//    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
//  }
//  res.send(200)
//})
const PORT = process.env.PORT ?? 12348

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})