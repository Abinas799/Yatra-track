const { pool } = require('../config/database');

// Create new yatra
const createYatra = async (req, res) => {
  try {
    const { title, description, date, category, destination, budget, status } = req.body;
    const userId = req.user.id;

    const [result] = await pool.execute(
      'INSERT INTO yatras (user_id, title, description, date, category, destination, budget, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, title, description, date, category || 'leisure', destination, budget || 0, status || 'planned']
    );

    // Fetch the created yatra with user details
    const [yatras] = await pool.execute(
      `SELECT y.id, y.title, y.description, y.category, y.destination, y.date, y.budget, y.status, y.created_at, 
              u.name as user_name, u.email as user_email
       FROM yatras y 
       JOIN users u ON y.user_id = u.id 
       WHERE y.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Yatra created successfully',
      data: {
        yatra: yatras[0]
      }
    });

  } catch (error) {
    console.error('Create yatra error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all yatras for the authenticated user
const getYatras = async (req, res) => {
  try {
    const userId = req.user.id;

    const [yatras] = await pool.execute(
      `SELECT y.id, y.title, y.description, y.category, y.destination, y.date, y.budget, y.status, y.created_at, y.updated_at,
              u.name as user_name, u.email as user_email
       FROM yatras y 
       JOIN users u ON y.user_id = u.id 
       WHERE y.user_id = ?
       ORDER BY y.date ASC, y.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        yatras,
        count: yatras.length
      }
    });

  } catch (error) {
    console.error('Get yatras error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single yatra by ID
const getYatraById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [yatras] = await pool.execute(
      `SELECT y.id, y.title, y.description, y.category, y.destination, y.date, y.budget, y.status, y.created_at, y.updated_at,
              u.name as user_name, u.email as user_email
       FROM yatras y 
       JOIN users u ON y.user_id = u.id 
       WHERE y.id = ? AND y.user_id = ?`,
      [id, userId]
    );

    if (yatras.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Yatra not found'
      });
    }

    res.json({
      success: true,
      data: {
        yatra: yatras[0]
      }
    });

  } catch (error) {
    console.error('Get yatra by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update yatra
const updateYatra = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, category, destination, budget, status } = req.body;
    const userId = req.user.id;

    // Check if yatra exists and belongs to user
    const [existingYatras] = await pool.execute(
      'SELECT id FROM yatras WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingYatras.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Yatra not found'
      });
    }

    // Update yatra
    await pool.execute(
      'UPDATE yatras SET title = ?, description = ?, date = ?, category = ?, destination = ?, budget = ?, status = ? WHERE id = ? AND user_id = ?',
      [title, description, date, category, destination, budget, status, id, userId]
    );

    // Fetch updated yatra
    const [yatras] = await pool.execute(
      `SELECT y.id, y.title, y.description, y.category, y.destination, y.date, y.budget, y.status, y.created_at, y.updated_at,
              u.name as user_name, u.email as user_email
       FROM yatras y 
       JOIN users u ON y.user_id = u.id 
       WHERE y.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Yatra updated successfully',
      data: {
        yatra: yatras[0]
      }
    });

  } catch (error) {
    console.error('Update yatra error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete yatra
const deleteYatra = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if yatra exists and belongs to user
    const [existingYatras] = await pool.execute(
      'SELECT id FROM yatras WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingYatras.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Yatra not found'
      });
    }

    // Delete yatra
    await pool.execute(
      'DELETE FROM yatras WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({
      success: true,
      message: 'Yatra deleted successfully'
    });

  } catch (error) {
    console.error('Delete yatra error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Travel Companions Management

// Add travel companion
const addCompanion = async (req, res) => {
  try {
    const { yatraId } = req.params;
    const { name, email, relationship, phone } = req.body;
    const userId = req.user.id;

    // Check if yatra exists and belongs to user
    const [yatras] = await pool.execute(
      'SELECT id FROM yatras WHERE id = ? AND user_id = ?',
      [yatraId, userId]
    );

    if (yatras.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Yatra not found'
      });
    }

    // Add companion
    const [result] = await pool.execute(
      'INSERT INTO travel_companions (yatra_id, name, email, relationship, phone) VALUES (?, ?, ?, ?, ?)',
      [yatraId, name, email, relationship, phone]
    );

    // Fetch the created companion
    const [companions] = await pool.execute(
      'SELECT * FROM travel_companions WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Travel companion added successfully',
      data: {
        companion: companions[0]
      }
    });

  } catch (error) {
    console.error('Add companion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get travel companions for a yatra
const getCompanions = async (req, res) => {
  try {
    const { yatraId } = req.params;
    const userId = req.user.id;

    // Check if yatra exists and belongs to user
    const [yatras] = await pool.execute(
      'SELECT id FROM yatras WHERE id = ? AND user_id = ?',
      [yatraId, userId]
    );

    if (yatras.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Yatra not found'
      });
    }

    // Get companions
    const [companions] = await pool.execute(
      'SELECT * FROM travel_companions WHERE yatra_id = ? ORDER BY created_at ASC',
      [yatraId]
    );

    res.json({
      success: true,
      data: {
        companions,
        count: companions.length
      }
    });

  } catch (error) {
    console.error('Get companions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update travel companion
const updateCompanion = async (req, res) => {
  try {
    const { yatraId, companionId } = req.params;
    const { name, email, relationship, phone } = req.body;
    const userId = req.user.id;

    // Check if yatra exists and belongs to user
    const [yatras] = await pool.execute(
      'SELECT id FROM yatras WHERE id = ? AND user_id = ?',
      [yatraId, userId]
    );

    if (yatras.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Yatra not found'
      });
    }

    // Check if companion exists and belongs to the yatra
    const [companions] = await pool.execute(
      'SELECT id FROM travel_companions WHERE id = ? AND yatra_id = ?',
      [companionId, yatraId]
    );

    if (companions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Travel companion not found'
      });
    }

    // Update companion
    await pool.execute(
      'UPDATE travel_companions SET name = ?, email = ?, relationship = ?, phone = ? WHERE id = ? AND yatra_id = ?',
      [name, email, relationship, phone, companionId, yatraId]
    );

    // Fetch updated companion
    const [updatedCompanions] = await pool.execute(
      'SELECT * FROM travel_companions WHERE id = ?',
      [companionId]
    );

    res.json({
      success: true,
      message: 'Travel companion updated successfully',
      data: {
        companion: updatedCompanions[0]
      }
    });

  } catch (error) {
    console.error('Update companion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete travel companion
const deleteCompanion = async (req, res) => {
  try {
    const { yatraId, companionId } = req.params;
    const userId = req.user.id;

    // Check if yatra exists and belongs to user
    const [yatras] = await pool.execute(
      'SELECT id FROM yatras WHERE id = ? AND user_id = ?',
      [yatraId, userId]
    );

    if (yatras.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Yatra not found'
      });
    }

    // Check if companion exists and belongs to the yatra
    const [companions] = await pool.execute(
      'SELECT id FROM travel_companions WHERE id = ? AND yatra_id = ?',
      [companionId, yatraId]
    );

    if (companions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Travel companion not found'
      });
    }

    // Delete companion
    await pool.execute(
      'DELETE FROM travel_companions WHERE id = ? AND yatra_id = ?',
      [companionId, yatraId]
    );

    res.json({
      success: true,
      message: 'Travel companion deleted successfully'
    });

  } catch (error) {
    console.error('Delete companion error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  createYatra,
  getYatras,
  getYatraById,
  updateYatra,
  deleteYatra,
  addCompanion,
  getCompanions,
  updateCompanion,
  deleteCompanion
}; 