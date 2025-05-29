import express from 'express'
import bodyParser from 'body-parser'
import loginRouter from './routes/users.js'
import videoRouter from './routes/videos.js'
import path from 'path';
import mongoose from 'mongoose';
import customEnv from 'custom-env';
import cors from 'cors';
import net from 'net';

customEnv.env(process.env.NODE_ENV , './config')
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())
// Serve static files from the React build folder
app.use(express.static(path.join(process.cwd(), 'public')));


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
/*
import cors from 'cors';

app.use(cors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));

*/
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.static('public'))
app.use('/uploads', express.static('uploads/videos'));

// client.js


// const client = new net.Socket();
// const serverIP = '192.168.205.145'; // Replace with your WSL IP address
// const serverPort = 5555;

// client.connect(serverPort, serverIP, () => {
//     console.log('Connected to C++ server');
//     client.write('Hello from Node.js server');
// });

// client.on('data', (data) => {
//     console.log('Received from C++ server:', data.toString());
//     client.destroy(); // Close the connection after receiving the response
// });

// client.on('close', () => {
//     console.log('Connection closed');
// });

// client.on('error', (err) => {
//     console.error('Connection error:', err);
// });




//app.get('foo.com/api/videos')

app.use('/api' , loginRouter);
app.use('/api/videos', videoRouter);


app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });

app.listen(process.env.PORT)