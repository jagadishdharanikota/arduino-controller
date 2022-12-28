import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/appinno', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null },
  last_name: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

const User = mongoose.model('user', userSchema);

// const User = mongoose.model('User', { username: String, password: String });

export default User;
