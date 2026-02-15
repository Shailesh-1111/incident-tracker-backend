import express from 'express';
import cors from 'cors';
import incidentRoutes from './routes/incidentRoutes';
import errorHandler from './middlewares/errorHandler';

const app = express();

app.use(cors({
    origin: '*', // In production, replace '*' with your specific Netlify frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
