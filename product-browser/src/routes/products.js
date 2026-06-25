const router = require("express").Router();
const prisma = require("../prisma");
const {
  encodeCursor,
  decodeCursor,
} = require("../utils/cursor");

router.get("/", async (req, res) => {
  try {
    const limit = Math.min(
      Number(req.query.limit) || 20,
      100
    );

    const category = req.query.category;
    const cursor = req.query.cursor;

    let snapshot = req.query.snapshot;

    if (!snapshot) {
      snapshot = new Date().toISOString();
    }

    const where = {
      AND: [
        {
          updatedAt: {
            lte: new Date(snapshot),
          },
        },
      ],
    };

    // category filter
    if (category) {
      where.AND.push({
        category,
      });
    }

    // cursor filter
    if (cursor) {
      const c = decodeCursor(cursor);

      where.AND.push({
        OR: [
          {
            updatedAt: {
              lt: new Date(c.updatedAt),
            },
          },
          {
            AND: [
              {
                updatedAt: new Date(c.updatedAt),
              },
              {
                id: {
                  lt: BigInt(c.id),
                },
              },
            ],
          },
        ],
      });
    }

    const products =
      await prisma.product.findMany({
        where,
        orderBy: [
          {
            updatedAt: "desc",
          },
          {
            id: "desc",
          },
        ],
        take: limit,
      });

    const safeProducts = products.map(
      (p) => ({
        id: p.id.toString(),
        name: p.name,
        category: p.category,
        price: p.price.toString(),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })
    );

    let nextCursor = null;

    if (products.length === limit) {
      const last =
        products[products.length - 1];

      nextCursor = encodeCursor({
        updatedAt:
          last.updatedAt.toISOString(),
        id: last.id.toString(),
      });
    }

    res.json({
      snapshot,
      nextCursor,
      count: safeProducts.length,
      products: safeProducts,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = router;