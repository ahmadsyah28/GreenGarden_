'use strict';

/**
 * GreenGarden – Admin Creation Script (CommonJS)
 * ------------------------------------------------
 * − Loads environment variables (from ../.env.local or ../.env)
 * − Validates required ENV keys
 * − Validates and hashes admin credentials
 * − Inserts or updates the admin account in MongoDB
 *
 * Run with:  node create_admin.js
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

/* -------------------------- ENVIRONMENT HANDLING -------------------------- */

function loadEnvironmentVariables() {
  const possiblePaths = [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env')
  ];

  console.log('📁 Searching for environment files...');

  for (const fullPath of possiblePaths) {
    if (fs.existsSync(fullPath)) {
      console.log(`✅ Found environment file: ${fullPath}`);
      dotenv.config({ path: fullPath });
      return fullPath;
    }

    console.log(`❌ Not found: ${fullPath}`);
  }

  console.log('⚠️  No environment file found, falling back to system ENV');
  return null;
}

const envFilePath = loadEnvironmentVariables();

function validateEnvVars() {
  const requiredVars = ['MONGODB_URI']; // add others if necessary
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/* --------------------------- FIELD VALIDATION ----------------------------- */

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const issues = [];
  if (password.length < minLength) issues.push(`minimal ${minLength} karakter`);
  if (!hasUpperCase) issues.push('huruf besar');
  if (!hasLowerCase) issues.push('huruf kecil');
  if (!hasNumbers) issues.push('angka');
  if (!hasSpecial) issues.push('karakter khusus (!@#$%^&*(),.?":{}|<>)');

  return { isValid: issues.length === 0, issues };
}

/* ---------------------------- ADMIN PAYLOAD ------------------------------- */

const adminData = {
  name: 'Admin GreenGarden',
  email: 'admin@greengarden.com',
  password: 'Admin123!', // strong default — change in production!
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

/* ------------------------------ MAIN FLOW --------------------------------- */

async function createAdmin() {
  let client;

  try {
    // Validate ENV
    console.log('\n🔍 Validating environment variables...');
    validateEnvVars();

    // Validate admin fields
    console.log('🔍 Validating admin data...');
    if (!isValidEmail(adminData.email)) {
      throw new Error('Format email tidak valid');
    }

    const pwdCheck = validatePassword(adminData.password);
    if (!pwdCheck.isValid) {
      throw new Error(`Password tidak memenuhi syarat. Diperlukan: ${pwdCheck.issues.join(', ')}`);
    }

    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const users = db.collection('users');

    // Ensure unique email index
    await users.createIndex({ email: 1 }, { unique: true }).catch(() => {});

    // Show credentials (informational)
    console.log('\n🔐 Creating admin with:');
    console.log(`   📧 Email : ${adminData.email}`);
    console.log(`   👤 Name  : ${adminData.name}`);
    console.log(`   🔑 Pass  : ${adminData.password}`);

    // Hash password
    console.log('🔒 Hashing password...');
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Upsert admin
    const result = await users.updateOne(
      { email: adminData.email },
      {
        $set: {
          ...adminData,
          password: hashedPassword,
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    console.log(result.upsertedId ? '✅ Admin account created' : '✅ Admin account updated');

    // Verify
    const verify = await users.findOne({ email: adminData.email }, { projection: { password: 0 } });
    console.log('\n📋 Admin details:', verify);
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    if (err.code === 11000) {
      console.error('📧 Email sudah digunakan oleh user lain');
    }
    process.exitCode = 1;
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 MongoDB connection closed');
    }
  }
}

console.log('🌱 GreenGarden – Admin Creation Script');
createAdmin().then(() => console.log('\n🎉 Script finished'));
