const express = require('express');
const router = express.Router();
const { 
  createYatra, 
  getYatras, 
  getYatraById, 
  updateYatra, 
  deleteYatra,
  addCompanion,
  getCompanions,
  updateCompanion,
  deleteCompanion
} = require('../controllers/yatraController');
const { validateYatra, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// All yatra routes require authentication
router.use(authenticateToken);

// CRUD operations
router.post('/', validateYatra, handleValidationErrors, createYatra);
router.get('/', getYatras);
router.get('/:id', getYatraById);
router.put('/:id', validateYatra, handleValidationErrors, updateYatra);
router.delete('/:id', deleteYatra);

// Travel companions routes
router.post('/:yatraId/companions', addCompanion);
router.get('/:yatraId/companions', getCompanions);
router.put('/:yatraId/companions/:companionId', updateCompanion);
router.delete('/:yatraId/companions/:companionId', deleteCompanion);

module.exports = router; 