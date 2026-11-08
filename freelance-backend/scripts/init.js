import { pool } from '../src/db/pool.js';
import { initializeDatabase } from '../src/db/schema.js';
import { hashPassword } from '../src/utils/helpers.js';

// Initialize database schema and seed demo data.
const initialize = async () => {
  try {
    console.log('🗄️  Initializing database...');
    const success = await initializeDatabase();

    if (!success) {
      console.error('Failed to initialize database');
      process.exit(1);
    }

    console.log('✅ Database initialized successfully');

    await seedSampleData();

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Initialization error:', error);
    await pool.end();
    process.exit(1);
  }
};

async function seedSampleData() {
  try {
    console.log('🌱 Seeding demo data...');
    const client = await pool.connect();
    const passwordHash = await hashPassword('Demo1234');

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
        name: 'Client Demo',
        role: 'client',
      },
    ];

    try {
      for (const user of users) {
        const checkResult = await client.query('SELECT id FROM users WHERE email = $1', [
          user.email,
        ]);

        if (checkResult.rows.length === 0) {
          await client.query(
            `INSERT INTO users (email, password, name, role, hourly_rate, skills)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              user.email,
              passwordHash,
              user.name,
              user.role,
              user.hourly_rate || null,
              user.skills || null,
            ]
          );
        }
      }
    } finally {
      client.release();
    }

    console.log('✅ Demo data seeded successfully');
    console.log('   Demo password for seeded accounts: Demo1234');
  } catch (error) {
    console.error('Seeding error:', error);
  }
}

initialize();
