import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  phone: text('phone'),
  avatar: text('avatar'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 定义categories表，使用不同的方式处理自引用关系
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  parentId: integer('parent_id').references((): any => categories.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  brand: text('brand'),
  model: text('model'),
  condition: text('condition').notNull(), // 成色
  originalPrice: real('original_price'),
  aiEstimatedPrice: real('ai_estimated_price'),
  userPrice: real('user_price').notNull(),
  categoryId: integer('category_id').references(() => categories.id),
  sellerId: integer('seller_id').references(() => users.id),
  status: text('status').notNull().default('available'), // available, sold, reserved
  images: text('images', { mode: 'json' }), // JSON array of image URLs
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const pricingFactors = sqliteTable('pricing_factors', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').references(() => products.id),
  brandValue: real('brand_value'), // 品牌价值评分 0-10
  marketDemand: real('market_demand'), // 市场供需评分 0-10
  conditionScore: real('condition_score'), // 成色评分 0-10
  usageDuration: integer('usage_duration'), // 使用时间（月数）
  functionalityScore: real('functionality_score'), // 功能完整性评分 0-10
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  buyerId: integer('buyer_id').references(() => users.id),
  sellerId: integer('seller_id').references(() => users.id),
  productId: integer('product_id').references(() => products.id),
  dealPrice: real('deal_price').notNull(),
  status: text('status').notNull().default('pending'), // pending, completed, cancelled
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const priceHistory = sqliteTable('price_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').references(() => products.id),
  priceType: text('price_type').notNull(), // user_price, ai_estimated, deal_price
  price: real('price').notNull(),
  recordedAt: text('recorded_at').notNull(),
  createdAt: text('created_at').notNull(),
});

export const productReviews = sqliteTable('product_reviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').references(() => products.id),
  userId: integer('user_id').references(() => users.id),
  rating: integer('rating').notNull(), // 1-5
  content: text('content'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});