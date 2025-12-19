import { prisma } from './src/utils/prisma';
import bcrypt from 'bcrypt';

async function main() {
    const passwordHash = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            email: 'alice@example.com',
            name: 'Alice User',
            passwordHash,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: {
            email: 'bob@example.com',
            name: 'Bob User',
            passwordHash,
        },
    });

    console.log({ user1, user2 });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
