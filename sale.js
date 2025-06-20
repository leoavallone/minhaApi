const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SaleSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, default: 1 }
    }],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'partially_returned', 'returned'], default: 'completed' },
  originalSale: { type: Schema.Types.ObjectId, ref: 'Sale' } // se for cópia sem devolução
});

const Sale = mongoose.model('Sale', SaleSchema);
module.exports = Sale;