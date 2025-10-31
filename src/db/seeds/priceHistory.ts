import { db } from '@/db';
import { priceHistory } from '@/db/schema';

async function main() {
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate.getTime() - (90 * 24 * 60 * 60 * 1000));
    
    const samplePriceHistory = [
        // iPhone 14 Pro (Product ID: 1) - Price evolution over time
        {
            productId: 1,
            priceType: 'user_price',
            price: 8500.00,
            recordedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
            createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        },
        {
            productId: 1,
            priceType: 'ai_estimated',
            price: 7800.00,
            recordedAt: new Date('2024-01-15T10:30:00Z').toISOString(),
            createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
        },
        {
            productId: 1,
            priceType: 'user_price',
            price: 8200.00,
            recordedAt: new Date('2024-01-20T14:15:00Z').toISOString(),
            createdAt: new Date('2024-01-20T14:15:00Z').toISOString(),
        },
        {
            productId: 1,
            priceType: 'ai_estimated',
            price: 7750.00,
            recordedAt: new Date('2024-01-25T16:20:00Z').toISOString(),
            createdAt: new Date('2024-01-25T16:20:00Z').toISOString(),
        },
        {
            productId: 1,
            priceType: 'user_price',
            price: 7900.00,
            recordedAt: new Date('2024-02-01T09:45:00Z').toISOString(),
            createdAt: new Date('2024-02-01T09:45:00Z').toISOString(),
        },
        {
            productId: 1,
            priceType: 'deal_price',
            price: 7700.00,
            recordedAt: new Date('2024-02-05T18:30:00Z').toISOString(),
            createdAt: new Date('2024-02-05T18:30:00Z').toISOString(),
        },

        // MacBook Air M2 (Product ID: 2) - Gradual price adjustments
        {
            productId: 2,
            priceType: 'user_price',
            price: 7500.00,
            recordedAt: new Date('2024-01-10T11:20:00Z').toISOString(),
            createdAt: new Date('2024-01-10T11:20:00Z').toISOString(),
        },
        {
            productId: 2,
            priceType: 'ai_estimated',
            price: 7200.00,
            recordedAt: new Date('2024-01-10T11:45:00Z').toISOString(),
            createdAt: new Date('2024-01-10T11:45:00Z').toISOString(),
        },
        {
            productId: 2,
            priceType: 'user_price',
            price: 7300.00,
            recordedAt: new Date('2024-01-18T13:10:00Z').toISOString(),
            createdAt: new Date('2024-01-18T13:10:00Z').toISOString(),
        },
        {
            productId: 2,
            priceType: 'ai_estimated',
            price: 7150.00,
            recordedAt: new Date('2024-01-28T15:30:00Z').toISOString(),
            createdAt: new Date('2024-01-28T15:30:00Z').toISOString(),
        },
        {
            productId: 2,
            priceType: 'user_price',
            price: 7100.00,
            recordedAt: new Date('2024-02-08T12:00:00Z').toISOString(),
            createdAt: new Date('2024-02-08T12:00:00Z').toISOString(),
        },

        // AirPods Pro 2 (Product ID: 3) - Multiple price changes
        {
            productId: 3,
            priceType: 'user_price',
            price: 1800.00,
            recordedAt: new Date('2024-01-12T08:15:00Z').toISOString(),
            createdAt: new Date('2024-01-12T08:15:00Z').toISOString(),
        },
        {
            productId: 3,
            priceType: 'ai_estimated',
            price: 1650.00,
            recordedAt: new Date('2024-01-12T08:30:00Z').toISOString(),
            createdAt: new Date('2024-01-12T08:30:00Z').toISOString(),
        },
        {
            productId: 3,
            priceType: 'user_price',
            price: 1700.00,
            recordedAt: new Date('2024-01-22T14:45:00Z').toISOString(),
            createdAt: new Date('2024-01-22T14:45:00Z').toISOString(),
        },
        {
            productId: 3,
            priceType: 'user_price',
            price: 1650.00,
            recordedAt: new Date('2024-02-02T10:20:00Z').toISOString(),
            createdAt: new Date('2024-02-02T10:20:00Z').toISOString(),
        },
        {
            productId: 3,
            priceType: 'deal_price',
            price: 1600.00,
            recordedAt: new Date('2024-02-10T16:45:00Z').toISOString(),
            createdAt: new Date('2024-02-10T16:45:00Z').toISOString(),
        },

        // iPad Pro 11 (Product ID: 4) - Price increase then decrease
        {
            productId: 4,
            priceType: 'user_price',
            price: 5500.00,
            recordedAt: new Date('2024-01-08T09:30:00Z').toISOString(),
            createdAt: new Date('2024-01-08T09:30:00Z').toISOString(),
        },
        {
            productId: 4,
            priceType: 'ai_estimated',
            price: 5200.00,
            recordedAt: new Date('2024-01-08T10:00:00Z').toISOString(),
            createdAt: new Date('2024-01-08T10:00:00Z').toISOString(),
        },
        {
            productId: 4,
            priceType: 'user_price',
            price: 5800.00,
            recordedAt: new Date('2024-01-25T11:15:00Z').toISOString(),
            createdAt: new Date('2024-01-25T11:15:00Z').toISOString(),
        },
        {
            productId: 4,
            priceType: 'ai_estimated',
            price: 5300.00,
            recordedAt: new Date('2024-02-05T13:20:00Z').toISOString(),
            createdAt: new Date('2024-02-05T13:20:00Z').toISOString(),
        },
        {
            productId: 4,
            priceType: 'user_price',
            price: 5400.00,
            recordedAt: new Date('2024-02-15T15:40:00Z').toISOString(),
            createdAt: new Date('2024-02-15T15:40:00Z').toISOString(),
        },

        // Apple Watch Series 8 (Product ID: 5)
        {
            productId: 5,
            priceType: 'user_price',
            price: 2800.00,
            recordedAt: new Date('2024-01-14T12:30:00Z').toISOString(),
            createdAt: new Date('2024-01-14T12:30:00Z').toISOString(),
        },
        {
            productId: 5,
            priceType: 'ai_estimated',
            price: 2500.00,
            recordedAt: new Date('2024-01-14T12:45:00Z').toISOString(),
            createdAt: new Date('2024-01-14T12:45:00Z').toISOString(),
        },
        {
            productId: 5,
            priceType: 'user_price',
            price: 2600.00,
            recordedAt: new Date('2024-01-28T16:20:00Z').toISOString(),
            createdAt: new Date('2024-01-28T16:20:00Z').toISOString(),
        },
        {
            productId: 5,
            priceType: 'deal_price',
            price: 2550.00,
            recordedAt: new Date('2024-02-12T14:10:00Z').toISOString(),
            createdAt: new Date('2024-02-12T14:10:00Z').toISOString(),
        },

        // Sony WH-1000XM4 (Product ID: 6)
        {
            productId: 6,
            priceType: 'user_price',
            price: 1200.00,
            recordedAt: new Date('2024-01-16T10:45:00Z').toISOString(),
            createdAt: new Date('2024-01-16T10:45:00Z').toISOString(),
        },
        {
            productId: 6,
            priceType: 'ai_estimated',
            price: 1050.00,
            recordedAt: new Date('2024-01-16T11:00:00Z').toISOString(),
            createdAt: new Date('2024-01-16T11:00:00Z').toISOString(),
        },
        {
            productId: 6,
            priceType: 'user_price',
            price: 1100.00,
            recordedAt: new Date('2024-02-01T13:30:00Z').toISOString(),
            createdAt: new Date('2024-02-01T13:30:00Z').toISOString(),
        },
        {
            productId: 6,
            priceType: 'user_price',
            price: 1000.00,
            recordedAt: new Date('2024-02-18T15:15:00Z').toISOString(),
            createdAt: new Date('2024-02-18T15:15:00Z').toISOString(),
        },

        // Nintendo Switch OLED (Product ID: 7)
        {
            productId: 7,
            priceType: 'user_price',
            price: 2200.00,
            recordedAt: new Date('2024-01-11T14:20:00Z').toISOString(),
            createdAt: new Date('2024-01-11T14:20:00Z').toISOString(),
        },
        {
            productId: 7,
            priceType: 'ai_estimated',
            price: 2000.00,
            recordedAt: new Date('2024-01-11T14:35:00Z').toISOString(),
            createdAt: new Date('2024-01-11T14:35:00Z').toISOString(),
        },
        {
            productId: 7,
            priceType: 'user_price',
            price: 2100.00,
            recordedAt: new Date('2024-01-30T11:50:00Z').toISOString(),
            createdAt: new Date('2024-01-30T11:50:00Z').toISOString(),
        },
        {
            productId: 7,
            priceType: 'deal_price',
            price: 2050.00,
            recordedAt: new Date('2024-02-20T17:25:00Z').toISOString(),
            createdAt: new Date('2024-02-20T17:25:00Z').toISOString(),
        },

        // Canon EOS R6 (Product ID: 8)
        {
            productId: 8,
            priceType: 'user_price',
            price: 12000.00,
            recordedAt: new Date('2024-01-13T09:15:00Z').toISOString(),
            createdAt: new Date('2024-01-13T09:15:00Z').toISOString(),
        },
        {
            productId: 8,
            priceType: 'ai_estimated',
            price: 11200.00,
            recordedAt: new Date('2024-01-13T09:30:00Z').toISOString(),
            createdAt: new Date('2024-01-13T09:30:00Z').toISOString(),
        },
        {
            productId: 8,
            priceType: 'user_price',
            price: 11500.00,
            recordedAt: new Date('2024-02-03T12:40:00Z').toISOString(),
            createdAt: new Date('2024-02-03T12:40:00Z').toISOString(),
        },
        {
            productId: 8,
            priceType: 'user_price',
            price: 11200.00,
            recordedAt: new Date('2024-02-22T16:10:00Z').toISOString(),
            createdAt: new Date('2024-02-22T16:10:00Z').toISOString(),
        },

        // Tesla Model 3 Wheels (Product ID: 9)
        {
            productId: 9,
            priceType: 'user_price',
            price: 3500.00,
            recordedAt: new Date('2024-01-09T08:45:00Z').toISOString(),
            createdAt: new Date('2024-01-09T08:45:00Z').toISOString(),
        },
        {
            productId: 9,
            priceType: 'ai_estimated',
            price: 3200.00,
            recordedAt: new Date('2024-01-09T09:00:00Z').toISOString(),
            createdAt: new Date('2024-01-09T09:00:00Z').toISOString(),
        },
        {
            productId: 9,
            priceType: 'user_price',
            price: 3300.00,
            recordedAt: new Date('2024-01-26T14:30:00Z').toISOString(),
            createdAt: new Date('2024-01-26T14:30:00Z').toISOString(),
        },

        // Rolex Submariner (Product ID: 10)
        {
            productId: 10,
            priceType: 'user_price',
            price: 85000.00,
            recordedAt: new Date('2024-01-07T15:20:00Z').toISOString(),
            createdAt: new Date('2024-01-07T15:20:00Z').toISOString(),
        },
        {
            productId: 10,
            priceType: 'ai_estimated',
            price: 82000.00,
            recordedAt: new Date('2024-01-07T15:35:00Z').toISOString(),
            createdAt: new Date('2024-01-07T15:35:00Z').toISOString(),
        },
        {
            productId: 10,
            priceType: 'user_price',
            price: 87000.00,
            recordedAt: new Date('2024-01-21T10:15:00Z').toISOString(),
            createdAt: new Date('2024-01-21T10:15:00Z').toISOString(),
        },
        {
            productId: 10,
            priceType: 'user_price',
            price: 84000.00,
            recordedAt: new Date('2024-02-14T13:45:00Z').toISOString(),
            createdAt: new Date('2024-02-14T13:45:00Z').toISOString(),
        },

        // Additional entries for more recent dates
        {
            productId: 1,
            priceType: 'ai_estimated',
            price: 7600.00,
            recordedAt: new Date('2024-02-28T11:20:00Z').toISOString(),
            createdAt: new Date('2024-02-28T11:20:00Z').toISOString(),
        },
        {
            productId: 2,
            priceType: 'deal_price',
            price: 7050.00,
            recordedAt: new Date('2024-03-05T16:30:00Z').toISOString(),
            createdAt: new Date('2024-03-05T16:30:00Z').toISOString(),
        },
        {
            productId: 3,
            priceType: 'ai_estimated',
            price: 1580.00,
            recordedAt: new Date('2024-03-10T09:45:00Z').toISOString(),
            createdAt: new Date('2024-03-10T09:45:00Z').toISOString(),
        },
        {
            productId: 4,
            priceType: 'deal_price',
            price: 5250.00,
            recordedAt: new Date('2024-03-12T14:15:00Z').toISOString(),
            createdAt: new Date('2024-03-12T14:15:00Z').toISOString(),
        },
        {
            productId: 5,
            priceType: 'ai_estimated',
            price: 2400.00,
            recordedAt: new Date('2024-03-08T12:30:00Z').toISOString(),
            createdAt: new Date('2024-03-08T12:30:00Z').toISOString(),
        },
        {
            productId: 6,
            priceType: 'deal_price',
            price: 980.00,
            recordedAt: new Date('2024-03-15T17:20:00Z').toISOString(),
            createdAt: new Date('2024-03-15T17:20:00Z').toISOString(),
        },
        {
            productId: 7,
            priceType: 'ai_estimated',
            price: 1950.00,
            recordedAt: new Date('2024-03-18T10:40:00Z').toISOString(),
            createdAt: new Date('2024-03-18T10:40:00Z').toISOString(),
        },
        {
            productId: 8,
            priceType: 'deal_price',
            price: 11000.00,
            recordedAt: new Date('2024-03-20T15:55:00Z').toISOString(),
            createdAt: new Date('2024-03-20T15:55:00Z').toISOString(),
        },
        {
            productId: 9,
            priceType: 'deal_price',
            price: 3150.00,
            recordedAt: new Date('2024-03-22T11:10:00Z').toISOString(),
            createdAt: new Date('2024-03-22T11:10:00Z').toISOString(),
        },
        {
            productId: 10,
            priceType: 'deal_price',
            price: 83500.00,
            recordedAt: new Date('2024-03-25T16:00:00Z').toISOString(),
            createdAt: new Date('2024-03-25T16:00:00Z').toISOString(),
        },

        // Additional recent entries for better data spread
        {
            productId: 11,
            priceType: 'user_price',
            price: 4500.00,
            recordedAt: new Date('2024-02-16T10:30:00Z').toISOString(),
            createdAt: new Date('2024-02-16T10:30:00Z').toISOString(),
        },
        {
            productId: 11,
            priceType: 'ai_estimated',
            price: 4200.00,
            recordedAt: new Date('2024-02-16T10:45:00Z').toISOString(),
            createdAt: new Date('2024-02-16T10:45:00Z').toISOString(),
        },
        {
            productId: 11,
            priceType: 'user_price',
            price: 4300.00,
            recordedAt: new Date('2024-03-01T14:20:00Z').toISOString(),
            createdAt: new Date('2024-03-01T14:20:00Z').toISOString(),
        },
        {
            productId: 12,
            priceType: 'user_price',
            price: 1800.00,
            recordedAt: new Date('2024-02-18T09:15:00Z').toISOString(),
            createdAt: new Date('2024-02-18T09:15:00Z').toISOString(),
        },
        {
            productId: 12,
            priceType: 'ai_estimated',
            price: 1650.00,
            recordedAt: new Date('2024-02-18T09:30:00Z').toISOString(),
            createdAt: new Date('2024-02-18T09:30:00Z').toISOString(),
        },
        {
            productId: 12,
            priceType: 'deal_price',
            price: 1700.00,
            recordedAt: new Date('2024-03-04T16:45:00Z').toISOString(),
            createdAt: new Date('2024-03-04T16:45:00Z').toISOString(),
        },
        {
            productId: 13,
            priceType: 'user_price',
            price: 2500.00,
            recordedAt: new Date('2024-02-20T11:00:00Z').toISOString(),
            createdAt: new Date('2024-02-20T11:00:00Z').toISOString(),
        },
        {
            productId: 13,
            priceType: 'ai_estimated',
            price: 2300.00,
            recordedAt: new Date('2024-02-20T11:15:00Z').toISOString(),
            createdAt: new Date('2024-02-20T11:15:00Z').toISOString(),
        },
        {
            productId: 13,
            priceType: 'user_price',
            price: 2400.00,
            recordedAt: new Date('2024-03-06T13:30:00Z').toISOString(),
            createdAt: new Date('2024-03-06T13:30:00Z').toISOString(),
        },
        {
            productId: 14,
            priceType: 'user_price',
            price: 6800.00,
            recordedAt: new Date('2024-02-22T15:45:00Z').toISOString(),
            createdAt: new Date('2024-02-22T15:45:00Z').toISOString(),
        },
        {
            productId: 14,
            priceType: 'ai_estimated',
            price: 6400.00,
            recordedAt: new Date('2024-02-22T16:00:00Z').toISOString(),
            createdAt: new Date('2024-02-22T16:00:00Z').toISOString(),
        },
        {
            productId: 15,
            priceType: 'user_price',
            price: 3200.00,
            recordedAt: new Date('2024-02-24T12:20:00Z').toISOString(),
            createdAt: new Date('2024-02-24T12:20:00Z').toISOString(),
        },
        {
            productId: 15,
            priceType: 'ai_estimated',
            price: 2950.00,
            recordedAt: new Date('2024-02-24T12:35:00Z').toISOString(),
            createdAt: new Date('2024-02-24T12:35:00Z').toISOString(),
        },
        {
            productId: 15,
            priceType: 'deal_price',
            price: 3050.00,
            recordedAt: new Date('2024-03-14T17:10:00Z').toISOString(),
            createdAt: new Date('2024-03-14T17:10:00Z').toISOString(),
        }
    ];

    await db.insert(priceHistory).values(samplePriceHistory);
    
    console.log('✅ Price history seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});