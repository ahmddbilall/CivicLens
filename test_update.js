const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb+srv://shameer:hK5u2FwO8rD7sR3@cluster0.hckf3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  const User = require('./lib/models/User').default;
  
  const user = await User.findOne();
  if (!user) {
    console.log("No users found");
    process.exit(1);
  }
  
  console.log('Original:', user.preferences);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: { preferences: { pushNotifications: false, emailAlerts: true, language: 'ur' } } },
    { new: true }
  );

  console.log('Updated:', updatedUser.preferences);
  process.exit(0);
}

test().catch(console.error);
