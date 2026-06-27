const prisma = require('../config/prisma');

class ProductService {
  /**
   * Fetch products using cursor pagination
   * Sorting is by updated_at DESC, id DESC to prevent duplicates/missing records
   */
  static async getProducts({ limit = 20, cursor, category }) {
    const take = parseInt(limit, 10);
    
    // Base configuration
    let queryArgs = {
      take: take + 1, // Fetch +1 to determine if there is a next page
      skip: cursor ? 1 : 0, // skip the cursor itself
      orderBy: [
        { updated_at: 'desc' },
        { id: 'desc' } // Tie-breaker ensures deterministic absolute ordering
      ],
      where: {}
    };

    // Filter by category if provided
    if (category) {
      queryArgs.where.category = category;
    }

    // Cursor pagination (Keyset)
    if (cursor) {
      queryArgs.cursor = {
        id: cursor
      };
    }

    const results = await prisma.product.findMany(queryArgs);
    
    let nextCursor = null;
    if (results.length > take) {
      const nextItem = results.pop(); // Remove the +1 item
      nextCursor = nextItem.id; // Store ID for next cursor request
    }

    return {
      data: results,
      nextCursor
    };
  }
}

module.exports = ProductService;
