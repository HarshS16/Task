import { db, schema } from './db/index.js';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    console.log('Seeding database...');

    // Create test users
    const users = [
        {
            id: uuidv4(),
            email: 'user@example.com',
            name: 'Regular User',
            password: 'password123',
            isSubscriber: false
        },
        {
            id: uuidv4(),
            email: 'subscriber@example.com',
            name: 'Premium Subscriber',
            password: 'password123',
            isSubscriber: true
        }
    ];

    for (const user of users) {
        try {
            await db.insert(schema.users).values(user);
            console.log(`Created user: ${user.email}`);
        } catch (e) {
            console.log(`User ${user.email} may already exist`);
        }
    }

    // Create sample deals
    const deals = [
        {
            id: uuidv4(),
            title: 'Sony WH-1000XM5 Wireless Headphones',
            description: 'Industry-leading noise cancellation with Auto NC Optimizer, crystal-clear hands-free calling, and up to 30-hour battery life.',
            imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            originalPrice: 399.99,
            currentPrice: 298.00,
            bestPrice: 278.00,
            retailer: 'Amazon',
            productUrl: 'https://amazon.com/dp/example1',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Apple MacBook Air M3 (2024)',
            description: 'Supercharged by the M3 chip. 15.3" Liquid Retina display. Up to 18 hours of battery life.',
            imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            originalPrice: 1299.00,
            currentPrice: 1099.00,
            bestPrice: 1049.00,
            retailer: 'Best Buy',
            productUrl: 'https://bestbuy.com/example2',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Nintendo Switch OLED Model',
            description: 'Enhanced audio, a wide adjustable stand, 64GB internal storage, and a vibrant 7-inch OLED screen.',
            imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400',
            originalPrice: 349.99,
            currentPrice: 319.99,
            bestPrice: null,
            retailer: 'GameStop',
            productUrl: 'https://gamestop.com/example3',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Dyson V15 Detect Vacuum',
            description: 'Intelligently optimizes power and run time with a piezo sensor. Laser reveals microscopic dust.',
            imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
            originalPrice: 749.99,
            currentPrice: 649.99,
            bestPrice: 599.99,
            retailer: 'Dyson',
            productUrl: 'https://dyson.com/example4',
            status: 'expired' as const,
            expiresAt: '2024-01-01T00:00:00Z'
        },
        {
            id: uuidv4(),
            title: 'Samsung 65" OLED 4K Smart TV',
            description: 'Neural Quantum Processor with 4K Upscaling. Self-lit OLED for perfect blacks and vibrant colors.',
            imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
            originalPrice: 2499.99,
            currentPrice: 1799.99,
            bestPrice: 1699.99,
            retailer: 'Samsung',
            productUrl: 'https://samsung.com/example5',
            status: 'disabled' as const
        },
        {
            id: uuidv4(),
            title: 'Bose QuietComfort Ultra Earbuds',
            description: 'World-class noise cancellation with immersive spatial audio. CustomTune technology.',
            imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
            originalPrice: 299.00,
            currentPrice: 249.00,
            bestPrice: 229.00,
            retailer: 'Bose',
            productUrl: 'https://bose.com/example6',
            status: 'active' as const
        }
    ];

    for (const deal of deals) {
        try {
            await db.insert(schema.deals).values(deal);
            console.log(`Created deal: ${deal.title}`);
        } catch (e) {
            console.log(`Deal ${deal.title} may already exist`);
        }
    }

    console.log('Seeding completed!');
    console.log('\nTest Accounts:');
    console.log('- Regular User: user@example.com / password123');
    console.log('- Subscriber: subscriber@example.com / password123');
}

seed().catch(console.error);
