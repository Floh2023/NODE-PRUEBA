import cors from 'cors'

const ACEPTED_ORIGINS = [
  'http://localhost:123',
  'http://localhost:12349',
  'http://localhost:60745'
]

export const corsMiddleware = ({ acceptedOrigins = ACEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }
    if (!origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
})
