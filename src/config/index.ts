import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(process.cwd(), '.env')});

const config = {
    port: process.env.PORT || 5000,
    connectionString: process.env.CONNECTION_STRING || '',
    jwtSecret: process.env.JWT_SECRET || 'fkjkfmvdvkm;vvmkvdlkvdk'
};

export default config;


