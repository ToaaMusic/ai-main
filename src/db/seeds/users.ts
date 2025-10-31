import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const sampleUsers = [
        {
            username: 'zhangsan',
            email: 'zhangsan@qq.com',
            password: '$2b$10$rOzHqZ8Y3K5L2P9X7Q1V4eGHJKL6M8N9O0P1Q2R3S4T5U6V7W8X9Y',
            phone: '13812345678',
            avatar: 'https://avatars.githubusercontent.com/u/1234567?v=4',
            createdAt: new Date('2024-07-15').toISOString(),
            updatedAt: new Date('2024-07-15').toISOString(),
        },
        {
            username: '李小明',
            email: 'lixiaoming@163.com',
            password: '$2b$10$sP0AiS9Z4L6M3Q0Y8R2W5fHIKMN7O9P0Q1R2S3T4U5V6W7X8Y9Z0A',
            phone: '13923456789',
            avatar: null,
            createdAt: new Date('2024-08-02').toISOString(),
            updatedAt: new Date('2024-08-02').toISOString(),
        },
        {
            username: 'mike_chen',
            email: 'mike.chen@gmail.com',
            password: '$2b$10$tQ1BjT0A5M7N4R1Z9S3X6gJKLNO8P0Q1R2S3T4U5V6W7X8Y9Z0A1B',
            phone: '13634567890',
            avatar: 'https://avatars.githubusercontent.com/u/2345678?v=4',
            createdAt: new Date('2024-08-20').toISOString(),
            updatedAt: new Date('2024-08-20').toISOString(),
        },
        {
            username: '王丽娜',
            email: 'wanglina@qq.com',
            password: '$2b$10$uR2CkU1B6N8O5S2A0T4Y7hKLMOP9Q1R2S3T4U5V6W7X8Y9Z0A1B2C',
            phone: '13745678901',
            avatar: 'https://avatars.githubusercontent.com/u/3456789?v=4',
            createdAt: new Date('2024-09-05').toISOString(),
            updatedAt: new Date('2024-09-05').toISOString(),
        },
        {
            username: 'john_doe',
            email: 'john.doe@hotmail.com',
            password: '$2b$10$vS3DlV2C7O9P6T3B1U5Z8iLMNPQ0R2S3T4U5V6W7X8Y9Z0A1B2C3D',
            phone: '13856789012',
            avatar: null,
            createdAt: new Date('2024-09-18').toISOString(),
            updatedAt: new Date('2024-09-18').toISOString(),
        },
        {
            username: '陈大华',
            email: 'chendahua@163.com',
            password: '$2b$10$wT4EmW3D8P0Q7U4C2V6A9jMNOQR1S3T4U5V6W7X8Y9Z0A1B2C3D4E',
            phone: '13967890123',
            avatar: 'https://avatars.githubusercontent.com/u/4567890?v=4',
            createdAt: new Date('2024-10-01').toISOString(),
            updatedAt: new Date('2024-10-01').toISOString(),
        },
        {
            username: 'sarah_liu',
            email: 'sarah.liu@gmail.com',
            password: '$2b$10$xU5FnX4E9Q1R8V5D3W7B0kNOPRS2T4U5V6W7X8Y9Z0A1B2C3D4E5F',
            phone: '13078901234',
            avatar: null,
            createdAt: new Date('2024-10-12').toISOString(),
            updatedAt: new Date('2024-10-12').toISOString(),
        },
        {
            username: '张伟',
            email: 'zhangwei@qq.com',
            password: '$2b$10$yV6GoY5F0R2S9W6E4X8C1lOPQST3U5V6W7X8Y9Z0A1B2C3D4E5F6G',
            phone: '13189012345',
            avatar: 'https://avatars.githubusercontent.com/u/5678901?v=4',
            createdAt: new Date('2024-10-25').toISOString(),
            updatedAt: new Date('2024-10-25').toISOString(),
        },
        {
            username: 'david_wang',
            email: 'david.wang@163.com',
            password: '$2b$10$zW7HpZ6G1S3T0X7F5Y9D2mPQRTU4V6W7X8Y9Z0A1B2C3D4E5F6G7H',
            phone: '13290123456',
            avatar: null,
            createdAt: new Date('2024-11-08').toISOString(),
            updatedAt: new Date('2024-11-08').toISOString(),
        },
        {
            username: '刘芳',
            email: 'liufang@hotmail.com',
            password: '$2b$10$aX8IqA7H2T4U1Y8G6Z0E3nQRSUV5W7X8Y9Z0A1B2C3D4E5F6G7H8I',
            phone: '13301234567',
            avatar: 'https://avatars.githubusercontent.com/u/6789012?v=4',
            createdAt: new Date('2024-11-20').toISOString(),
            updatedAt: new Date('2024-11-20').toISOString(),
        },
        {
            username: 'alex_zhou',
            email: 'alex.zhou@gmail.com',
            password: '$2b$10$bY9JrB8I3U5V2Z9H7A1F4oRSTVW6X8Y9Z0A1B2C3D4E5F6G7H8I9J',
            phone: '13412345678',
            avatar: null,
            createdAt: new Date('2024-12-03').toISOString(),
            updatedAt: new Date('2024-12-03').toISOString(),
        },
        {
            username: '赵敏',
            email: 'zhaomin@qq.com',
            password: '$2b$10$cZ0KsC9J4V6W3A0I8B2G5pSTUWX7Y9Z0A1B2C3D4E5F6G7H8I9J0K',
            phone: '13523456789',
            avatar: 'https://avatars.githubusercontent.com/u/7890123?v=4',
            createdAt: new Date('2024-12-15').toISOString(),
            updatedAt: new Date('2024-12-15').toISOString(),
        },
        {
            username: 'tommy_li',
            email: 'tommy.li@163.com',
            password: '$2b$10$dA1LtD0K5W7X4B1J9C3H6qTUVXY8Z0A1B2C3D4E5F6G7H8I9J0K1L',
            phone: '13634567890',
            avatar: null,
            createdAt: new Date('2024-12-28').toISOString(),
            updatedAt: new Date('2024-12-28').toISOString(),
        },
        {
            username: '孙悟空',
            email: 'sunwukong@hotmail.com',
            password: '$2b$10$eB2MuE1L6X8Y5C2K0D4I7rUVWYZ9A1B2C3D4E5F6G7H8I9J0K1L2M',
            phone: '13745678901',
            avatar: 'https://avatars.githubusercontent.com/u/8901234?v=4',
            createdAt: new Date('2025-01-10').toISOString(),
            updatedAt: new Date('2025-01-10').toISOString(),
        },
        {
            username: 'jessica_xu',
            email: 'jessica.xu@gmail.com',
            password: '$2b$10$fC3NvF2M7Y9Z6D3L1E5J8sVWXZA0B2C3D4E5F6G7H8I9J0K1L2M3N',
            phone: '13856789012',
            avatar: null,
            createdAt: new Date('2025-01-22').toISOString(),
            updatedAt: new Date('2025-01-22').toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});