"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrismaMock = void 0;
const vitest_1 = require("vitest");
const createPrismaMock = () => ({
    user: {
        findUnique: vitest_1.vi.fn(),
        findMany: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
    },
    sale: {
        findUnique: vitest_1.vi.fn(),
        findMany: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
    },
    inventory: {
        findUnique: vitest_1.vi.fn(),
        findMany: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        delete: vitest_1.vi.fn(),
    },
    account: {
        findUnique: vitest_1.vi.fn(),
        findMany: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
    },
    transaction: {
        create: vitest_1.vi.fn(),
        findMany: vitest_1.vi.fn(),
    },
    invoice: {
        findFirst: vitest_1.vi.fn(),
        findMany: vitest_1.vi.fn(),
        findUnique: vitest_1.vi.fn(),
        create: vitest_1.vi.fn(),
        update: vitest_1.vi.fn(),
        count: vitest_1.vi.fn(),
    },
    $transaction: vitest_1.vi.fn(),
});
exports.createPrismaMock = createPrismaMock;
//# sourceMappingURL=prisma.mock.js.map