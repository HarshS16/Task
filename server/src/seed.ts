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

    // Clear existing deals to prevent duplicates
    console.log('Clearing existing deals...');
    await db.delete(schema.deals);
    console.log('Existing deals cleared.');

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
        },
        // New products added below
        {
            id: uuidv4(),
            title: 'iPhone 15 Pro Max 256GB',
            description: 'Titanium design, A17 Pro chip, 48MP camera system with 5x optical zoom, and USB-C with USB 3 speeds.',
            imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
            originalPrice: 1199.00,
            currentPrice: 1099.00,
            bestPrice: 1049.00,
            retailer: 'Apple',
            productUrl: 'https://apple.com/iphone-15-pro-max',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Sony PlayStation 5 Slim',
            description: 'Smaller, sleeker PS5 with 1TB SSD. Experience lightning-fast loading, haptic feedback, and 4K gaming.',
            imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
            originalPrice: 499.99,
            currentPrice: 449.99,
            bestPrice: 429.99,
            retailer: 'PlayStation Direct',
            productUrl: 'https://playstation.com/ps5-slim',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Canon EOS R6 Mark II Mirrorless Camera',
            description: '24.2MP full-frame sensor, 40fps continuous shooting, 6K video recording, and advanced subject detection AF.',
            imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
            originalPrice: 2499.00,
            currentPrice: 2299.00,
            bestPrice: 2199.00,
            retailer: 'B&H Photo',
            productUrl: 'https://bhphoto.com/canon-eos-r6-ii',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Apple Watch Ultra 2',
            description: '49mm titanium case, precision GPS, 100m water resistance, 36-hour battery life, and bright 3000 nit display.',
            imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
            originalPrice: 799.00,
            currentPrice: 749.00,
            bestPrice: 699.00,
            retailer: 'Apple',
            productUrl: 'https://apple.com/watch-ultra-2',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'LG 34" UltraWide Curved Gaming Monitor',
            description: '34" QHD (3440x1440) curved display, 160Hz refresh rate, 1ms response time, G-Sync compatible.',
            imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
            originalPrice: 699.99,
            currentPrice: 549.99,
            bestPrice: 499.99,
            retailer: 'Newegg',
            productUrl: 'https://newegg.com/lg-ultrawide-34',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Nespresso Vertuo Next Coffee Machine',
            description: 'Centrifusion technology for perfect coffee, 5 cup sizes, automatic capsule recognition, Bluetooth connectivity.',
            imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
            originalPrice: 179.00,
            currentPrice: 129.00,
            bestPrice: 99.00,
            retailer: 'Williams Sonoma',
            productUrl: 'https://williams-sonoma.com/nespresso-vertuo',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Razer BlackWidow V4 Pro Mechanical Keyboard',
            description: 'Razer Green mechanical switches, Chroma RGB lighting, magnetic wrist rest, 8000Hz polling rate.',
            imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
            originalPrice: 229.99,
            currentPrice: 199.99,
            bestPrice: 179.99,
            retailer: 'Razer',
            productUrl: 'https://razer.com/blackwidow-v4-pro',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Peloton Bike+ Indoor Exercise Bike',
            description: '24" rotating HD touchscreen, auto-resistance, Apple GymKit compatible, immersive sound system.',
            imageUrl: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400',
            originalPrice: 2495.00,
            currentPrice: 1995.00,
            bestPrice: 1795.00,
            retailer: 'Peloton',
            productUrl: 'https://peloton.com/bike-plus',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Sonos Arc Soundbar',
            description: 'Premium smart soundbar with Dolby Atmos, 11 high-performance drivers, Trueplay tuning, voice control.',
            imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400',
            originalPrice: 899.00,
            currentPrice: 799.00,
            bestPrice: 749.00,
            retailer: 'Sonos',
            productUrl: 'https://sonos.com/arc',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'DJI Mini 4 Pro Drone',
            description: '4K/60fps HDR video, 48MP photos, omnidirectional obstacle sensing, 34-min flight time, under 249g.',
            imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
            originalPrice: 759.00,
            currentPrice: 699.00,
            bestPrice: 649.00,
            retailer: 'DJI',
            productUrl: 'https://dji.com/mini-4-pro',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Samsung Galaxy Tab S9 Ultra',
            description: '14.6" Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, S Pen included, IP68 water resistance.',
            imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
            originalPrice: 1199.99,
            currentPrice: 999.99,
            bestPrice: 949.99,
            retailer: 'Samsung',
            productUrl: 'https://samsung.com/galaxy-tab-s9-ultra',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Logitech MX Master 3S Wireless Mouse',
            description: 'Quiet clicks, 8K DPI sensor, MagSpeed electromagnetic scrolling, USB-C charging, multi-device support.',
            imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
            originalPrice: 99.99,
            currentPrice: 89.99,
            bestPrice: 79.99,
            retailer: 'Logitech',
            productUrl: 'https://logitech.com/mx-master-3s',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Philips Hue Starter Kit (4 Bulbs + Bridge)',
            description: '16 million colors, voice control compatible, sync with music and games, schedule and automate lighting.',
            imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            originalPrice: 199.99,
            currentPrice: 159.99,
            bestPrice: 139.99,
            retailer: 'Philips',
            productUrl: 'https://philips-hue.com/starter-kit',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Theragun Pro Massage Device',
            description: 'Professional-grade percussive therapy, 6 attachments, OLED screen, 300-min battery life, Bluetooth app.',
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
            originalPrice: 599.00,
            currentPrice: 499.00,
            bestPrice: 449.00,
            retailer: 'Therabody',
            productUrl: 'https://therabody.com/theragun-pro',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'ASUS ROG Strix G16 Gaming Laptop',
            description: 'Intel Core i9-13980HX, RTX 4070, 16" QHD 240Hz display, 32GB DDR5 RAM, 1TB NVMe SSD.',
            imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
            originalPrice: 1899.99,
            currentPrice: 1699.99,
            bestPrice: 1599.99,
            retailer: 'ASUS',
            productUrl: 'https://asus.com/rog-strix-g16',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'KitchenAid Artisan Stand Mixer',
            description: '5-quart stainless steel bowl, 10 speeds, 59-point planetary mixing action, power hub for attachments.',
            imageUrl: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=400',
            originalPrice: 449.99,
            currentPrice: 379.99,
            bestPrice: 329.99,
            retailer: 'KitchenAid',
            productUrl: 'https://kitchenaid.com/artisan-mixer',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'GoPro HERO12 Black Action Camera',
            description: '5.3K video, HyperSmooth 6.0 stabilization, HDR photo/video, waterproof to 33ft, GP-Log for color grading.',
            imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
            originalPrice: 399.99,
            currentPrice: 349.99,
            bestPrice: 299.99,
            retailer: 'GoPro',
            productUrl: 'https://gopro.com/hero12-black',
            status: 'active' as const
        },
        {
            id: uuidv4(),
            title: 'Kindle Paperwhite Signature Edition',
            description: '6.8" display, wireless charging, auto-adjusting front light, 32GB storage, 10-week battery life.',
            imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400',
            originalPrice: 189.99,
            currentPrice: 154.99,
            bestPrice: 129.99,
            retailer: 'Amazon',
            productUrl: 'https://amazon.com/kindle-paperwhite-signature',
            status: 'expired' as const,
            expiresAt: '2025-12-31T00:00:00Z'
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
