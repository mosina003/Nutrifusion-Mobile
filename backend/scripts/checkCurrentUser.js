const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nutrifusion', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Import models
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const DietPlan = require('../models/DietPlan');

async function checkUser() {
  try {
    // Get all users
    const users = await User.find({}).select('name email preferredMedicalFramework hasCompletedAssessment createdAt');
    
    console.log('\n📋 ALL USERS:');
    console.log('═══════════════════════════════════════════════════════════════');
    
    for (const user of users) {
      console.log(`\n👤 User: ${user.name} (${user.email})`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Framework: ${user.preferredMedicalFramework || 'Not set'}`);
      console.log(`   Has Completed Assessment: ${user.hasCompletedAssessment}`);
      console.log(`   Created: ${user.createdAt}`);
      
      // Check assessments
      const assessments = await Assessment.find({ userId: user._id })
        .sort({ completedAt: -1 })
        .select('framework isActive completedAt scores');
      
      console.log(`\n   📊 ASSESSMENTS (${assessments.length} total):`);
      if (assessments.length === 0) {
        console.log('      ❌ No assessments found');
      } else {
        for (const assessment of assessments) {
          console.log(`      - ${assessment.framework} | Active: ${assessment.isActive} | Completed: ${assessment.completedAt}`);
          console.log(`        ID: ${assessment._id}`);
          console.log(`        Has Scores: ${!!assessment.scores}`);
        }
      }
      
      // Check diet plans
      const dietPlans = await DietPlan.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .select('planName planType status validFrom validTo createdAt meals');
      
      console.log(`\n   🍽️  DIET PLANS (${dietPlans.length} total):`);
      if (dietPlans.length === 0) {
        console.log('      ❌ No diet plans found');
      } else {
        for (const plan of dietPlans) {
          const today = new Date();
          const isWithinDates = plan.validFrom <= today && plan.validTo >= today;
          console.log(`      - ${plan.planName} (${plan.planType})`);
          console.log(`        ID: ${plan._id}`);
          console.log(`        Status: ${plan.status}`);
          console.log(`        Valid: ${plan.validFrom.toLocaleDateString()} - ${plan.validTo.toLocaleDateString()}`);
          console.log(`        Within Dates: ${isWithinDates}`);
          console.log(`        Meals Count: ${plan.meals?.length || 0}`);
          console.log(`        Created: ${plan.createdAt}`);
        }
      }
      
      console.log('\n───────────────────────────────────────────────────────────────');
    }
    
    console.log('\n✅ Check complete!');
    console.log('\n💡 DIAGNOSIS:');
    console.log('   1. Check if user has hasCompletedAssessment = true');
    console.log('   2. Check if there is an assessment with isActive = true');
    console.log('   3. Check if there is a diet plan with status = "Active" and within valid dates');
    console.log('   4. Check if preferredMedicalFramework matches the assessment framework');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

checkUser();
