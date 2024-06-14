import mongoose from 'mongoose';

const BlacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1d' }  // Tokens will expire after 1 day
});

const BlacklistedToken = mongoose.model('blacklisted_tokens', BlacklistedTokenSchema);

export default BlacklistedToken;