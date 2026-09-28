const Estimation = require('../models/estimationModel');
const Inventory = require('../models/inventoryModel');

// @desc    Get all estimations
// @route   GET /api/estimations
// @access  Private
const getEstimations = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }
    const estimations = await Estimation.find(query).populate('items.product').populate('createdBy', 'name').sort({ createdAt: -1 });
    res.status(200).json(estimations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single estimation
// @route   GET /api/estimations/:id
// @access  Private
const getEstimation = async (req, res) => {
  try {
    const estimation = await Estimation.findById(req.params.id).populate('items.product').populate('createdBy', 'name');
    if (!estimation) {
      return res.status(404).json({ message: 'Estimation not found' });
    }
    res.status(200).json(estimation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new estimation
// @route   POST /api/estimations
// @access  Private
const createEstimation = async (req, res) => {
  try {
    const { 
      customerName, customerId, customerType, address, phone, capacity, 
      appNo, challanNo, dispatchedThrough, vehicleNo, driverMob, dispatchFrom, 
      items, notes, status 
    } = req.body;
    
    // Calculate total amount
    let totalAmount = 0;
    if (Array.isArray(items)) {
      for (const item of items) {
        totalAmount += ((item.quantity || 1) * (item.price || 0));
      }
    }

    const estimationData = {
      customerName,
      customerId,
      customerType: customerType || 'Lead',
      address: address || '',
      phone: phone || '',
      capacity: capacity || '',
      appNo: appNo || '',
      challanNo: challanNo || '',
      dispatchedThrough: dispatchedThrough || '',
      vehicleNo: vehicleNo || '',
      driverMob: driverMob || '',
      dispatchFrom: dispatchFrom || 'Store',
      items: items || [],
      notes: notes || '',
      status: status || 'Finalized',
      totalAmount,
      createdBy: req.user._id
    };

    const estimation = await Estimation.create(estimationData);
    res.status(201).json(estimation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update estimation status
// @route   PATCH /api/estimations/:id/status
// @access  Private
const updateEstimationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const estimation = await Estimation.findById(req.params.id);

    if (!estimation) {
      return res.status(404).json({ message: 'Estimation not found' });
    }

    estimation.status = status;
    await estimation.save();

    res.status(200).json(estimation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete estimation
// @route   DELETE /api/estimations/:id
// @access  Private/Admin
const deleteEstimation = async (req, res) => {
  try {
    const estimation = await Estimation.findById(req.params.id);
    if (!estimation) {
      return res.status(404).json({ message: 'Estimation not found' });
    }

    await estimation.deleteOne();
    res.status(200).json({ message: 'Estimation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEstimations,
  getEstimation,
  createEstimation,
  updateEstimationStatus,
  deleteEstimation,
};
