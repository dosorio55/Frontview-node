import express from "express";
import { connection } from "./database.js";
import cors from "cors";
import { userRoutes } from "./routes/user.routes.js";
import { profileRoutes } from "./routes/profille.routes.js";
import { projectRoutes } from "./routes/project.routes.js";

connection();

const PORT = process.env.PORT;
const router = express.Router();
const server = express();


//headers setups
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.use(cors({
    origin: ['*'],
    credentials: true,
}));

//Midlewares
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

//Routes
router.get('/', (req, res) => {
    res.send('Hola de nuevo desde mongo')
});

server.set("secretKey", "nodeRestApi");

server.use('/', router);
server.use('/user', userRoutes);
server.use('/profiles', profileRoutes);
server.use('/project', projectRoutes);

//control de errores
server.use('*', (req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});


server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
});


//control de errores
server.use('*', (req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

server.listen(PORT, () => {
    console.log(`Mi super servidor está corriendo en http://localhost:${PORT}`)
});
