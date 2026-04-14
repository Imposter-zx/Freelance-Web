import { pool } from '../server.js';
import { initializeDatabase } from './src/db/schema.js';

// Initialize database schema and seed data
const initialize = async () => {
  try {
    console.log('🗄️  Initializing database...');
    const success = await initializeDatabase();

    if (!success) {
      console.error('Failed to initialize database');
      process.exit(1);
    }

    console.log('✅ Database initialized successfully');

    // Seed sample data
    await seedSampleData();

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Initialization error:', error);
    process.exit(1);
  }
};

async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...');
    
    const client = await pool.connect();

    // Sample users
    const users = [
      {
        email: 'jean@example.com',
        name: 'Jean Dupont',
        role: 'freelancer',
        hourly_rate: 50,
        skills: ['React', 'Node.js', 'AWS'],
      },
      {
        email: 'sophie@example.com',
        name: 'Sophie Martin',
        role: 'freelancer',
        hourly_rate: 45,
        skills: ['Figma', 'Webflow', 'UI/UX'],
      },
      {
        email: 'client@example.com',
        name: 'Client User',
        role: 'client',
      },
    ];

    for (const user of users) {
      const checkResult = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [user.email]
      );

      if (checkResult.rows.length === 0) {
        await client.query(
          `INSERT INTO users (email, password, name, role, hourly_rate, skills)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            user.email,
            '$2a$10$placeholder', // Placeholder, should be hashed in real scenario
            user.name,
            user.role,
            user.hourly_rate || null,
            user.skills ? `{${user.skills.join(',')}}` : null,
          ]
        );
      }
    }

    console.log('✅ Sample data seeded successfully');
    client.release();
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

initialize();
