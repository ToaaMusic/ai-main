import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products, categories, users, pricingFactors } from '@/db/schema';
import { eq, desc, asc, and, like, gte, lte, sql } from 'drizzle-orm';

// 获取商品列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    // 构建查询条件
    let whereConditions = [];
    
    if (category) {
      whereConditions.push(eq(products.categoryId, parseInt(category)));
    }
    
    if (search) {
      whereConditions.push(
        sql`${products.title} LIKE ${`%${search}%`} OR ${products.description} LIKE ${`%${search}%`} OR ${products.brand} LIKE ${`%${search}%`}`
      );
    }
    
    if (minPrice) {
      whereConditions.push(gte(products.userPrice, parseFloat(minPrice)));
    }
    
    if (maxPrice) {
      whereConditions.push(lte(products.userPrice, parseFloat(maxPrice)));
    }
    
    if (condition) {
      whereConditions.push(eq(products.condition, condition));
    }

    // 查询商品
    const productsQuery = db
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
        categoryName: categories.name,
        sellerName: users.username,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .limit(limit)
      .offset(offset);

    // 添加排序
    if (sortBy === 'price') {
      productsQuery.orderBy(sortOrder === 'desc' ? desc(products.userPrice) : asc(products.userPrice));
    } else if (sortBy === 'createdAt') {
      productsQuery.orderBy(sortOrder === 'desc' ? desc(products.createdAt) : asc(products.createdAt));
    }

    const productsList = await productsQuery;

    // 获取总数
    const totalCountResult = await db
      .select({ count: sql`count(*)` })
      .from(products)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
    
    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      products: productsList,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(Number(totalCount) / limit),
      },
    });
  } catch (error) {
    console.error('获取商品列表失败:', error);
    return NextResponse.json(
      { error: '获取商品列表失败' },
      { status: 500 }
    );
  }
}

// 创建新商品
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      brand,
      model,
      condition,
      originalPrice,
      userPrice,
      categoryId,
      sellerId,
      images,
    } = body;

    if (!title || !userPrice || !categoryId || !sellerId) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // TODO: 这里会调用AI定价模块来估算价格
    // 现在先使用一个简单的估算逻辑
    const aiEstimatedPrice = userPrice * 0.85; // 简单估算为用户价格的85%

    const newProduct = await db
      .insert(products)
      .values({
        title,
        description,
        brand,
        model,
        condition,
        originalPrice,
        aiEstimatedPrice,
        userPrice,
        categoryId,
        sellerId,
        status: 'available',
        images: JSON.stringify(images || []),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newProduct[0], { status: 201 });
  } catch (error) {
    console.error('创建商品失败:', error);
    return NextResponse.json(
      { error: '创建商品失败' },
      { status: 500 }
    );
  }
}