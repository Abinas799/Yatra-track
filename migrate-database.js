const { pool } = require('./server/config/database');

const migrateDatabase = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    const connection = await pool.getConnection();
    
    // Add new columns to yatras table if they don't exist
    console.log('📝 Adding new columns to yatras table...');
    
    try {
      await connection.execute(`
        ALTER TABLE yatras 
        ADD COLUMN category ENUM('business', 'leisure', 'adventure', 'family', 'romantic', 'educational', 'other') DEFAULT 'leisure' AFTER description
      `);
      console.log('✅ Added category column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Category column already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await connection.execute(`
        ALTER TABLE yatras 
        ADD COLUMN destination VARCHAR(255) AFTER category
      `);
      console.log('✅ Added destination column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Destination column already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await connection.execute(`
        ALTER TABLE yatras 
        ADD COLUMN budget DECIMAL(10,2) DEFAULT 0.00 AFTER date
      `);
      console.log('✅ Added budget column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Budget column already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await connection.execute(`
        ALTER TABLE yatras 
        ADD COLUMN status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned' AFTER budget
      `);
      console.log('✅ Added status column');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('ℹ️  Status column already exists');
      } else {
        throw error;
      }
    }
    
    // Create travel_companions table
    console.log('📝 Creating travel_companions table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS travel_companions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        yatra_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        relationship VARCHAR(100),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (yatra_id) REFERENCES yatras(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Created travel_companions table');
    
    // Create indexes
    console.log('📝 Creating indexes...');
    try {
      await connection.execute('CREATE INDEX idx_yatras_category ON yatras(category)');
      console.log('✅ Created category index');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Category index already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await connection.execute('CREATE INDEX idx_yatras_status ON yatras(status)');
      console.log('✅ Created status index');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Status index already exists');
      } else {
        throw error;
      }
    }
    
    try {
      await connection.execute('CREATE INDEX idx_companions_yatra_id ON travel_companions(yatra_id)');
      console.log('✅ Created companions index');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('ℹ️  Companions index already exists');
      } else {
        throw error;
      }
    }
    
    connection.release();
    
    console.log('🎉 Database migration completed successfully!');
    console.log('\n📊 New features added:');
    console.log('   • Travel categories (business, leisure, adventure, etc.)');
    console.log('   • Destination tracking');
    console.log('   • Budget management');
    console.log('   • Trip status tracking');
    console.log('   • Travel companions management');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDatabase().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}

module.exports = { migrateDatabase }; 