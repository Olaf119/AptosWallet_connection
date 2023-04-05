

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  wallet: {
    type: String
  },
});

module.exports = Wallet = mongoose.model("users", WalletSchema);