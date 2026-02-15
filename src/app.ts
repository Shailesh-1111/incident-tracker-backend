import express from 'express';
import cors from 'cors';
import incidentRoutes from './routes/incidentRoutes';
import errorHandler from './middlewares/errorHandler';

const app = express();

// Request logging for debugging production issues
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.get('origin')}`);
    next();
});

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://incident-tracker-frontend.netlify.app',
    'http://localhost:5173'
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('netlify.app')) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(null, true); // Temporarily allow all during debug, but log warning
        }
    },
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
