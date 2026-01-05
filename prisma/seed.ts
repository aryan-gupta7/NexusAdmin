const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@nexus.com' },
        update: {},
        create: {
            email: 'admin@nexus.com',
            name: 'Nexus Admin',
            password: 'password', // Note: In real app, hash this!
            role: 'ADMIN',
        },
    })
    // Seed Products
    const productsData = [
        { name: "Neural Link v2", price: 599.99, category: "Cyberware", stock: 50 },
        { name: "Holographic Visor", price: 299.00, category: "Accessories", stock: 120 },
        { name: "Quantum Processor", price: 1299.99, category: "Components", stock: 15 },
        { name: "Plasma Katana", price: 850.00, category: "Weapons", stock: 5 },
        { name: "Nano-Fiber Suit", price: 450.00, category: "Clothing", stock: 80 },
        { name: "Cyber-Arm (Left)", price: 2500.00, category: "Cyberware", stock: 10 },
        { name: "Smart Goggles", price: 199.99, category: "Accessories", stock: 200 },
        { name: "Data Shard (10TB)", price: 49.99, category: "Storage", stock: 500 },
    ];

    const products = [];
    for (const p of productsData) {
        const product = await prisma.product.create({
            data: {
                ...p,
                description: `High-tech ${p.name} for the modern runner.`,
                images: "[]",
            }
        });
        products.push(product);
    }

    // Seed Orders (Randomized)
    const customers = [
        { name: "Johnny Silver", email: "johnny@nightcity.com" },
        { name: "V", email: "v@afterlife.biz" },
        { name: "David Martinez", email: "david@edgerunners.net" },
        { name: "Lucy", email: "lucy@moon.com" },
        { name: "Jackie Welles", email: "jackie@heywood.com" },
    ];

    const statuses = ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"];

    for (let i = 0; i < 50; i++) {
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        // Pick 1-3 random products
        const orderItems = [];
        let total = 0;
        const numItems = Math.floor(Math.random() * 3) + 1;

        for (let j = 0; j < numItems; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            total += Number(product.price) * quantity;
            orderItems.push({
                productId: product.id,
                quantity,
                price: product.price
            });
        }

        await prisma.order.create({
            data: {
                customer: randomCustomer.name,
                email: randomCustomer.email,
                total,
                status: randomStatus,
                items: {
                    create: orderItems
                },
                createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)) // Random date in last 30 days
            }
        });
    }

    console.log({ admin, productsCreated: products.length, ordersCreated: 50 });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
