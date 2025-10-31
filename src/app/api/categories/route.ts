import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, isNull, sql } from 'drizzle-orm';

// 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeChildren = searchParams.get('includeChildren') === 'true';
    const parentId = searchParams.get('parentId');

    if (parentId === 'null' || parentId === '') {
      // 获取顶级分类
      const topLevelCategories = await db
        .select()
        .from(categories)
        .where(isNull(categories.parentId))
        .orderBy(categories.id);

      if (includeChildren) {
        // 为每个顶级分类获取子分类
        const categoriesWithChildren = await Promise.all(
          topLevelCategories.map(async (category) => {
            const children = await db
              .select()
              .from(categories)
              .where(eq(categories.parentId, category.id))
              .orderBy(categories.id);
            
            return {
              ...category,
              children,
            };
          })
        );
        
        return NextResponse.json(categoriesWithChildren);
      }

      return NextResponse.json(topLevelCategories);
    } else if (parentId) {
      // 获取特定父分类下的子分类
      const childCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.parentId, parseInt(parentId)))
        .orderBy(categories.id);

      return NextResponse.json(childCategories);
    } else {
      // 获取所有分类（扁平结构）
      const allCategories = await db
        .select()
        .from(categories)
        .orderBy(categories.id);

      return NextResponse.json(allCategories);
    }
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 }
    );
  }
}

// 创建新分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, parentId } = body;

    if (!name) {
      return NextResponse.json(
        { error: '分类名称是必填字段' },
        { status: 400 }
      );
    }

    // 插入新分类并获取结果
    const result = await db
      .insert(categories)
      .values({
        name,
        description,
        parentId: parentId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    // 处理不同的返回类型
    const newCategory = Array.isArray(result) ? result[0] : result;
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json(
      { error: '创建分类失败' },
      { status: 500 }
    );
  }
}