// CommonJS module version (not using ES modules)
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs'); // Using bcryptjs since it's already in your dependencies
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection string
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/greengarden';

// Admin credentials
const adminData = {
  name: 'Admin GreenGarden 2',
  email: 'admin2@greengarden.com',
  password: 'Admin123?', // Password yang mudah diingat
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
};

async function createAdmin() {
  let client;
  
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    // Get database and collection
    const database = client.db();
    const collection = database.collection('users');
    
    console.log('Creating admin account with the following credentials:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    
    // Hash password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);
    
    // Check if admin already exists
    const existingAdmin = await collection.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      // Update existing admin
      const result = await collection.updateOne(
        { email: adminData.email },
        { 
          $set: {
            name: adminData.name,
            password: hashedPassword,
            role: adminData.role,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`Admin account updated: ${result.modifiedCount} document(s) modified`);
    } else {
      // Create new admin
      const result = await collection.insertOne({
        ...adminData,
        password: hashedPassword
      });
      
      console.log(`Admin account created with ID: ${result.insertedId}`);
    }
    
  } catch (err) {
    console.error('Error creating admin account:', err);
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the function
createAdmin().catch(console.error);