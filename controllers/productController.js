const ProductService = require('../services/productService');

class ProductController {
  static async getProducts(req, res) {
    try {
      const { limit, cursor, category } = req.query;
      
      const parsedLimit = limit ? parseInt(limit, 10) : 20;
      if (isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({ error: 'Limit must be a positive integer.' });
      }

      const result = await ProductService.getProducts({
        limit: parsedLimit,
        cursor,
        category
      });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
}

module.exports = ProductController;
