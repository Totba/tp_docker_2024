const express = require('express');
const redis = require('redis');
const client = require('prom-client'); // Importer prom-client pour les métriques

const app = express();
const register = new client.Registry();

// Créer une métrique pour mesurer la durée des requêtes HTTP
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  registers: [register],
});

// Middleware pour capturer la durée des requêtes
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, code: res.statusCode });
  });
  next();
});

// Endpoint pour exposer les métriques Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Créer un client Redis
const redisClient = redis.createClient({
  host: 'redis', // 'redis' correspond au nom du service dans docker-compose.yml
  port: 6379
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Endpoint de santé (health check)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Exemple d'utilisation de Redis
app.get('/cache', (req, res) => {
  const key = 'example';
  redisClient.get(key, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (data) {
      return res.status(200).send(`Data from cache: ${data}`);
    } else {
      const newData = 'Hello from Redis!';
      redisClient.setex(key, 3600, newData); // Stocker la donnée avec une expiration de 3600s
      return res.status(200).send(`New data cached: ${newData}`);
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
