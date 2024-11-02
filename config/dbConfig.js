import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        dialectOptions: {
            ssl: {
                require: true, // This will require SSL connection
                rejectUnauthorized: false // Optional: set to false for testing locally or if you're using a self-signed certificate
            }
        }
    }
);

try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
} catch (error) {
    console.log("Some error occurred\n" + error);
}

export default sequelize;
