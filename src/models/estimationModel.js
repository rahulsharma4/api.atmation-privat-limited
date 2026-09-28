const mongoose = require('mongoose');

const estimationItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
  },
  name: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    default: '',
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  unit: {
    type: String,
    default: 'Nos',
  },
  price: {
    type: Number,
    default: 0,
  },
});

const estimationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  customerType: {
    type: String,
    enum: ['Lead', 'Contact'],
    default: 'Lead',
  },
  address: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  capacity: {
    type: String,
    default: '',
  },
  appNo: {
    type: String,
    default: '',
  },
  challanNo: {
    type: String,
    default: '',
  },
  dispatchedThrough: {
    type: String,
    default: '',
  },
  vehicleNo: {
    type: String,
    default: '',
  },
  driverMob: {
    type: String,
    default: '',
  },
  dispatchFrom: {
    type: String,
    default: 'Store',
  },
  items: [estimationItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Draft', 'Finalized', 'Cancelled'],
    default: 'Draft',
  },
  notes: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Estimation', estimationSchema);
