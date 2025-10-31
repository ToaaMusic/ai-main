import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// 确保上传目录存在
const ensureUploadDir = () => {
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

// 处理图片上传
export async function POST(request: Request, { params }: any) {
  try {
    const id = parseInt((await params).id);
    
    // 检查商品是否存在
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, id));
    
    if (!product.length) {
      return NextResponse.json(
        { error: '商品不存在' },
        { status: 404 }
      );
    }
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '没有提供文件' },
        { status: 400 }
      );
    }
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只支持图片文件' },
        { status: 400 }
      );
    }
    
    // 验证文件大小（限制5MB）
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过5MB' },
        { status: 400 }
      );
    }
    
    // 读取现有图片数据
    let imagesArray: string[] = [];
    if (product[0].images) {
      try {
        // 确保传入JSON.parse的是字符串
        const imagesStr = String(product[0].images);
        const parsedImages = JSON.parse(imagesStr);
        if (Array.isArray(parsedImages)) {
          // 过滤确保只保留字符串类型的元素
          imagesArray = parsedImages.filter(img => typeof img === 'string') as string[];
        }
      } catch {
        imagesArray = [];
      }
    }
    
    // 生成唯一文件名
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const uploadDir = ensureUploadDir();
    const filePath = path.join(uploadDir, fileName);
    
    // 保存文件
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    
    // 生成可访问的文件URL
    const fileUrl = `/uploads/${fileName}`;
    
    // 将新图片添加到数组开头（作为主图）
    imagesArray.unshift(fileUrl);
    
    // 限制最多5张图片
    if (imagesArray.length > 5) {
      imagesArray = imagesArray.slice(0, 5);
    }
    
    // 更新商品图片信息
    await db
      .update(products)
      .set({
        images: JSON.stringify(imagesArray),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, id));
    
    return NextResponse.json({
      success: true,
      images: imagesArray,
      message: '图片上传成功',
    });
  } catch (error) {
    console.error('上传图片失败:', error);
    return NextResponse.json(
      { error: '上传图片失败' },
      { status: 500 }
    );
  }
}