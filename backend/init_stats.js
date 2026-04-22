const mongoose = require('mongoose');
const { Stats } = require('./models');

mongoose.connect('mongodb://localhost:27017/privatechat')
  .then(async () => {
    console.log('Connected to MongoDB');
    const stats = await Stats.findOneAndUpdate(
      { key: 'total_users' },
      { value: 6 },
      { upsert: true, new: true }
    );
    console.log('Current stats:', stats);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
