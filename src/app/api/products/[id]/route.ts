import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories, users, pricingFactors, productReviews } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// 获取单个商品详情
export async function GET(request: Request, { params }: any) {
  try {
    const id = parseInt((await params).id);

    const productDetail = await db
      .select({
        id: products.id,
        title: products.title,
        description: products.description,
        brand: products.brand,
        model: products.model,
        condition: products.condition,
        originalPrice: products.originalPrice,
        aiEstimatedPrice: products.aiEstimatedPrice,
        userPrice: products.userPrice,
        status: products.status,
        images: products.images,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        categoryId: products.categoryId,
        categoryName: categories.name,
        sellerId: products.sellerId,
        sellerName: users.username,
        sellerAvatar: users.avatar,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(eq(products.id, id));

    if (!productDetail.length) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }

    const product = productDetail[0];

    // 获取定价因素
    const pricingData = await db
      .select()
      .from(pricingFactors)
      .where(eq(pricingFactors.productId, id));

    // 获取商品评价
    const reviews = await db
      .select({
        id: productReviews.id,
        rating: productReviews.rating,
        content: productReviews.content,
        createdAt: productReviews.createdAt,
        userName: users.username,
        userAvatar: users.avatar,
      })
      .from(productReviews)
      .leftJoin(users, eq(productReviews.userId, users.id))
      .where(eq(productReviews.productId, id));

    // 计算平均评分
    const avgRatingResult = await db
      .select({ avgRating: sql`avg(${productReviews.rating})` })
      .from(productReviews)
      .where(eq(productReviews.productId, id));

    const avgRating = avgRatingResult[0]?.avgRating || 0;

    return NextResponse.json({
      ...product,
      pricingFactors: pricingData[0] || null,
      reviews: reviews,
      averageRating: Number(avgRating),
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error('获取商品详情失败:', error);
    return NextResponse.json(
      { error: '获取商品详情失败' },
      { status: 500 }
    );
  }
}

// 更新商品信息
export async function PUT(request: Request, { params }: any) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedProduct = await db
      .update(products)
      .set({
        ...body,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct.length) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('更新商品失败:', error);
    return NextResponse.json(
      { error: '更新商品失败' },
      { status: 500 }
    );
  }
}

// 删除商品
export async function DELETE(request: Request, { params }: any) {
  try {
    const id = parseInt(params.id);

    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!deletedProduct.length) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '商品删除成功' });
  } catch (error) {
    console.error('删除商品失败:', error);
    return NextResponse.json(
      { error: '删除商品失败' },
      { status: 500 }
    );
  }
}