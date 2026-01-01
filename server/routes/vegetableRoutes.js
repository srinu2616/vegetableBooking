const express = require('express');
const router = express.Router();
const { getVegetables, getVegetableById, createVegetable, seedVegetables, deleteVegetable, updateVegetable } = require('../controllers/vegetableController');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getVegetables)
    .post(protect, admin, createVegetable);

router.post('/seed', seedVegetables);

router.route('/:id')
    .get(getVegetableById)
    .delete(protect, admin, deleteVegetable)
    .put(protect, admin, updateVegetable);

module.exports = router;
