import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        // Main categories (no parent)
        {
            name: '电子产品',
            description: '手机、电脑、数码相机等各类电子设备及配件',
            parentId: null,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: '家具家居',
            description: '沙发、桌椅、床具、厨具等家庭生活用品',
            parentId: null,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: '服装配饰',
            description: '男装女装、鞋靴包包、首饰配饰等时尚用品',
            parentId: null,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: '图书文具',
            description: '各类图书、学习用品、办公文具等知识文化用品',
            parentId: null,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: '运动器材',
            description: '健身器材、球类运动、户外运动等体育用品',
            parentId: null,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: '汽车用品',
            description: '汽车配件、车载设备、汽车美容用品等',
            parentId: null,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        {
            name: '母婴用品',
            description: '婴儿用品、儿童玩具、孕妇用品等母婴相关产品',
            parentId: null,
            createdAt: new Date('2024-01-01').toISOString(),
            updatedAt: new Date('2024-01-01').toISOString(),
        },
        // Sub-categories for 电子产品 (Electronics)
        {
            name: '手机',
            description: '智能手机、功能机及手机配件',
            parentId: 1,
            createdAt: new Date('2024-01-02').toISOString(),
            updatedAt: new Date('2024-01-02').toISOString(),
        },
        {
            name: '电脑',
            description: '台式机、笔记本电脑、平板电脑及电脑配件',
            parentId: 1,
            createdAt: new Date('2024-01-02').toISOString(),
            updatedAt: new Date('2024-01-02').toISOString(),
        },
        {
            name: '相机',
            description: '数码相机、单反相机、摄像设备及摄影配件',
            parentId: 1,
            createdAt: new Date('2024-01-02').toISOString(),
            updatedAt: new Date('2024-01-02').toISOString(),
        },
        {
            name: '耳机音响',
            description: '耳机、音响、音频设备及相关配件',
            parentId: 1,
            createdAt: new Date('2024-01-02').toISOString(),
            updatedAt: new Date('2024-01-02').toISOString(),
        },
        {
            name: '游戏设备',
            description: '游戏主机、掌机、游戏手柄及游戏周边',
            parentId: 1,
            createdAt: new Date('2024-01-02').toISOString(),
            updatedAt: new Date('2024-01-02').toISOString(),
        },
        // Sub-categories for 家具家居 (Furniture & Home)
        {
            name: '沙发',
            description: '布艺沙发、皮质沙发、实木沙发等各类沙发',
            parentId: 2,
            createdAt: new Date('2024-01-03').toISOString(),
            updatedAt: new Date('2024-01-03').toISOString(),
        },
        {
            name: '桌椅',
            description: '餐桌餐椅、办公桌椅、休闲桌椅等',
            parentId: 2,
            createdAt: new Date('2024-01-03').toISOString(),
            updatedAt: new Date('2024-01-03').toISOString(),
        },
        {
            name: '床具',
            description: '床架、床垫、床上用品等卧室家具',
            parentId: 2,
            createdAt: new Date('2024-01-03').toISOString(),
            updatedAt: new Date('2024-01-03').toISOString(),
        },
        {
            name: '厨具',
            description: '锅具、餐具、厨房小家电等烹饪用品',
            parentId: 2,
            createdAt: new Date('2024-01-03').toISOString(),
            updatedAt: new Date('2024-01-03').toISOString(),
        },
        {
            name: '装饰品',
            description: '挂画、花瓶、摆件等家居装饰用品',
            parentId: 2,
            createdAt: new Date('2024-01-03').toISOString(),
            updatedAt: new Date('2024-01-03').toISOString(),
        },
        // Sub-categories for 服装配饰 (Clothing & Accessories)
        {
            name: '男装',
            description: '男士服装、西装、休闲装等',
            parentId: 3,
            createdAt: new Date('2024-01-04').toISOString(),
            updatedAt: new Date('2024-01-04').toISOString(),
        },
        {
            name: '女装',
            description: '女士服装、连衣裙、上衣下装等',
            parentId: 3,
            createdAt: new Date('2024-01-04').toISOString(),
            updatedAt: new Date('2024-01-04').toISOString(),
        },
        {
            name: '鞋靴',
            description: '运动鞋、皮鞋、靴子等各类鞋履',
            parentId: 3,
            createdAt: new Date('2024-01-04').toISOString(),
            updatedAt: new Date('2024-01-04').toISOString(),
        },
        {
            name: '包包',
            description: '手提包、背包、钱包等各类包袋',
            parentId: 3,
            createdAt: new Date('2024-01-04').toISOString(),
            updatedAt: new Date('2024-01-04').toISOString(),
        },
        {
            name: '首饰',
            description: '项链、手镯、戒指、耳环等饰品',
            parentId: 3,
            createdAt: new Date('2024-01-04').toISOString(),
            updatedAt: new Date('2024-01-04').toISOString(),
        },
        // Sub-categories for 图书文具 (Books & Stationery)
        {
            name: '小说',
            description: '文学小说、网络小说、经典名著等',
            parentId: 4,
            createdAt: new Date('2024-01-05').toISOString(),
            updatedAt: new Date('2024-01-05').toISOString(),
        },
        {
            name: '教辅',
            description: '教材、习题集、考试辅导书等学习资料',
            parentId: 4,
            createdAt: new Date('2024-01-05').toISOString(),
            updatedAt: new Date('2024-01-05').toISOString(),
        },
        {
            name: '文具',
            description: '笔类、本册、办公用品等学习文具',
            parentId: 4,
            createdAt: new Date('2024-01-05').toISOString(),
            updatedAt: new Date('2024-01-05').toISOString(),
        },
        {
            name: '艺术书籍',
            description: '美术、设计、摄影等艺术类书籍',
            parentId: 4,
            createdAt: new Date('2024-01-05').toISOString(),
            updatedAt: new Date('2024-01-05').toISOString(),
        },
        // Sub-categories for 运动器材 (Sports Equipment)
        {
            name: '健身器材',
            description: '跑步机、哑铃、瑜伽垫等健身设备',
            parentId: 5,
            createdAt: new Date('2024-01-06').toISOString(),
            updatedAt: new Date('2024-01-06').toISOString(),
        },
        {
            name: '球类',
            description: '篮球、足球、乒乓球等各类球类运动用品',
            parentId: 5,
            createdAt: new Date('2024-01-06').toISOString(),
            updatedAt: new Date('2024-01-06').toISOString(),
        },
        {
            name: '户外用品',
            description: '帐篷、登山包、户外服装等户外运动装备',
            parentId: 5,
            createdAt: new Date('2024-01-06').toISOString(),
            updatedAt: new Date('2024-01-06').toISOString(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});