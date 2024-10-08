const express = require('express');
const app = express();
const connectDB = require('./config/db'); // Import the db connection module
const { connectConsumer } = require('./kafka/Consumer');
const { connectProducer } = require('./kafka/Producer');
const cors = require('cors');
const path = require('path');

app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect Kafka producer and consumer
//connectProducer().catch(console.error);
//connectConsumer().catch(console.error);

// Use Routes
app.use('/api/v1.0/shopping', require('./routes/userRoutes'));
app.use('/api/v1.0/shopping', require('./routes/productRoutes'));
app.use('/api/v1.0/shopping', require('./routes/orderRoutes'));
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
