import express from 'express';
import cors from 'cors';
import incidentRoutes from './routes/incidentRoutes';
import errorHandler from './middlewares/errorHandler';

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://incident-tracker-frontend.netlify.app',
    'http://localhost:5173'
].filter(Boolean) as string[];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());

// Routes
// Routes
app.use('/api/incidents', incidentRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.use(errorHandler);

export default app;
