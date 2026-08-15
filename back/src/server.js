

require('dotenv').config();
const express = require('express');
const { connectDB } = require('./config/database');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Swagger UI
try {
	const swaggerUi = require('swagger-ui-express');
	const swaggerSpec = require('./config/swagger');
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
	console.log('Swagger UI mounted at /api-docs');
} catch (err) {
	console.warn('swagger-ui-express not available:', err.message);
}

// Register routes
const routes = require('./routes');
app.use('/', routes);

app.get('/', (req, res) => {
	res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
	(async () => {
		try {
			// Connect to MongoDB (uses provided hackathon URI if none specified in env)
			await connectDB(process.env.DATABASE_URL);

			// Run seeder to create or recreate the single Pessoa
			const { seedRafael } = require('./config/seeder');
			await seedRafael();

			app.listen(PORT, () => {
				console.log(`Server listening on port ${PORT}`);
			});
		} catch (err) {
			console.error('Failed to start server due to DB connection or seeder error', err);
			process.exit(1);
		}
	})();
}

module.exports = app;
