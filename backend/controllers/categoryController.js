import pool from '../config/database.js'

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      'SELECT id, category_name FROM event_categories ORDER BY category_name'
    )

    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ message: 'Failed to fetch categories' })
  }
}
