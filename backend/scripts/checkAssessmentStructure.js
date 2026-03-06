const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutrifusion', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const Assessment = require('../models/Assessment');

async function checkAssessments() {
  try {
    // Get one assessment from each framework
    const frameworks = ['ayurveda', 'unani', 'tcm', 'modern'];
    
    for (const framework of frameworks) {
      console.log(`\n\n${'='.repeat(70)}`);
      console.log(`📊 ${framework.toUpperCase()} ASSESSMENT STRUCTURE`);
      console.log('='.repeat(70));
      
      const assessment = await Assessment.findOne({ 
        framework,
        isActive: true 
      }).sort({ completedAt: -1 });
      
      if (!assessment) {
        console.log(`❌ No active ${framework} assessment found`);
        continue;
      }
      
      console.log(`\n✅ Found assessment ID: ${assessment._id}`);
      console.log(`   User: ${assessment.userId}`);
      console.log(`   Completed: ${assessment.completedAt}`);
      
      console.log(`\n📋 SCORES STRUCTURE:`);
      console.log(JSON.stringify(assessment.scores, null, 2));
      
      console.log(`\n📝 RESPONSES SAMPLE (first 3 keys):`);
      const responseKeys = Object.keys(assessment.responses || {}).slice(0, 3);
      responseKeys.forEach(key => {
        console.log(`   ${key}:`, JSON.stringify(assessment.responses[key], null, 2));
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n\n🔌 Database connection closed');
    process.exit(0);
  }
}

checkAssessments();
