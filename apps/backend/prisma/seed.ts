import { PrismaClient, UserRole, SaleStatus, PaymentMethod, PaymentStatus, MovementType, AccountType, TransactionType, InvoiceStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
import { uuidv7 } from '../src/common/utils/uuid';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

/** Хэш пароля для seed-данных (первые символы видны при fallback в AuthService). */
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
  console.log('🌱 Seeding erpio-core database...\n');

  // ═══════════════════════════════════════════
  //  1. Пользователи
  // ═══════════════════════════════════════════

  const password = 'password';
  const hashed = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      id: uuidv7(),
      username: 'admin',
      email: 'admin@erpio.local',
      passwordHash: hashed,
      role: 'ADMIN' as UserRole,
    },
  });
  console.log(`  ✅ Admin: ${admin.username} / ${password}`);

  const manager = await prisma.user.upsert({
    where: { username: 'manager' },
    update: {},
    create: {
      id: uuidv7(),
      username: 'manager',
      email: 'manager@erpio.local',
      passwordHash: hashed,
      role: 'MANAGER' as UserRole,
    },
  });
  console.log(`  ✅ Manager: ${manager.username} / ${password}`);

  const cashier = await prisma.user.upsert({
    where: { username: 'cashier' },
    update: {},
    create: {
      id: uuidv7(),
      username: 'cashier',
      email: 'cashier@erpio.local',
      passwordHash: hashed,
      role: 'CASHIER' as UserRole,
    },
  });
  console.log(`  ✅ Cashier: ${cashier.username} / ${password}`);

  const warehouse = await prisma.user.upsert({
    where: { username: 'warehouse' },
    update: {},
    create: {
      id: uuidv7(),
      username: 'warehouse',
      email: 'warehouse@erpio.local',
      passwordHash: hashed,
      role: 'WAREHOUSE' as UserRole,
    },
  });
  console.log(`  ✅ Warehouse: ${warehouse.username} / ${password}\n`);

  // ═══════════════════════════════════════════
  //  2. Группы клиентов
  // ═══════════════════════════════════════════

  const vipGroup = await prisma.customerGroup.upsert({
    where: { name: 'VIP' },
    update: {},
    create: { id: uuidv7(), name: 'VIP', discount: 500 }, // 5%
  });
  const regularGroup = await prisma.customerGroup.upsert({
    where: { name: 'Постоянный' },
    update: {},
    create: { id: uuidv7(), name: 'Постоянный', discount: 300 }, // 3%
  });
  const wholesaleGroup = await prisma.customerGroup.upsert({
    where: { name: 'Оптовый' },
    update: {},
    create: { id: uuidv7(), name: 'Оптовый', discount: 1000 }, // 10%
  });
  console.log('  ✅ Groups: VIP, Постоянный, Оптовый');

  // ═══════════════════════════════════════════
  //  3. Клиенты
  // ═══════════════════════════════════════════

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        id: uuidv7(), name: 'Иван Петров', email: 'ivan@example.com', phone: '+7-900-111-22-33',
        groupId: vipGroup.id, discount: 500, isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        id: uuidv7(), name: 'ООО "Ромашка"', email: 'info@romashka.ru', phone: '+7-495-123-45-67',
        taxId: '7701123456', groupId: wholesaleGroup.id, discount: 1000, isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        id: uuidv7(), name: 'Анна Смирнова', email: 'anna@example.com', phone: '+7-900-222-33-44',
        groupId: regularGroup.id, discount: 300, isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        id: uuidv7(), name: 'Петр Сидоров', email: 'petr@example.com',
        address: 'ул. Ленина, д. 10, кв. 5', isActive: true,
      },
    }),
  ]);
  console.log(`  ✅ Customers: ${customers.length} created`);

  // ═══════════════════════════════════════════
  //  4. Категории (дерево)
  // ═══════════════════════════════════════════

  const catBakery = await prisma.category.create({
    data: { id: uuidv7(), name: 'Хлебобулочные изделия', sortOrder: 1, isActive: true },
  });
  const catBread = await prisma.category.create({
    data: { id: uuidv7(), name: 'Хлеб', parentId: catBakery.id, sortOrder: 1, isActive: true },
  });
  const catPastry = await prisma.category.create({
    data: { id: uuidv7(), name: 'Выпечка', parentId: catBakery.id, sortOrder: 2, isActive: true },
  });
  const catDairy = await prisma.category.create({
    data: { id: uuidv7(), name: 'Молочные продукты', sortOrder: 2, isActive: true },
  });
  const catMilk = await prisma.category.create({
    data: { id: uuidv7(), name: 'Молоко', parentId: catDairy.id, sortOrder: 1, isActive: true },
  });
  const catCheese = await prisma.category.create({
    data: { id: uuidv7(), name: 'Сыры', parentId: catDairy.id, sortOrder: 2, isActive: true },
  });
  const catDrinks = await prisma.category.create({
    data: { id: uuidv7(), name: 'Напитки', sortOrder: 3, isActive: true },
  });
  const catJuices = await prisma.category.create({
    data: { id: uuidv7(), name: 'Соки', parentId: catDrinks.id, sortOrder: 1, isActive: true },
  });

  console.log('  ✅ Categories: tree with 8 nodes');

  // ═══════════════════════════════════════════
  //  5. Товары и варианты
  // ═══════════════════════════════════════════

  const productBread = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Хлеб "Бородинский"', sku: 'BRD-001', barcode: '4600000000011',
      unit: 'шт', price: 6500, cost: 3800, categoryId: catBread.id, isActive: true,
    },
  });
  const productBaguette = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Багет французский', sku: 'BRD-002', barcode: '4600000000022',
      unit: 'шт', price: 4500, cost: 2500, categoryId: catBread.id, isActive: true,
    },
  });
  const productCroissant = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Круассан с шоколадом', sku: 'PAS-001', barcode: '4600000000033',
      unit: 'шт', price: 8900, cost: 5200, categoryId: catPastry.id, isActive: true,
    },
  });
  const productMilk3 = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Молоко 3.2%', sku: 'MLK-001', barcode: '4600000000044',
      unit: 'л', price: 7500, cost: 4800, categoryId: catMilk.id, isActive: true,
    },
  });
  const productMilk15 = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Молоко 1.5%', sku: 'MLK-002', barcode: '4600000000055',
      unit: 'л', price: 6900, cost: 4500, categoryId: catMilk.id, isActive: true,
    },
  });

  // Варианты: размеры упаковки
  await prisma.productVariant.createMany({
    data: [
      { id: uuidv7(), productId: productMilk3.id, name: '0.5 л', sku: 'MLK-001-05', price: 4500, cost: 2800, attributes: { volume: '0.5' } },
      { id: uuidv7(), productId: productMilk3.id, name: '1 л', sku: 'MLK-001-10', price: 7500, cost: 4800, attributes: { volume: '1.0' } },
      { id: uuidv7(), productId: productMilk3.id, name: '2 л', sku: 'MLK-001-20', price: 13500, cost: 8500, attributes: { volume: '2.0' } },
    ],
  });

  const productCheeseRussian = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Сыр "Российский"', sku: 'CHS-001', barcode: '4600000000066',
      unit: 'кг', price: 89900, cost: 65000, categoryId: catCheese.id, isActive: true,
    },
  });
  const productCheeseParm = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Сыр "Пармезан"', sku: 'CHS-002', barcode: '4600000000077',
      unit: 'кг', price: 149900, cost: 110000, categoryId: catCheese.id, isActive: true,
    },
  });
  const productJuiceApple = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Сок яблочный', sku: 'JCE-001', barcode: '4600000000088',
      unit: 'л', price: 12500, cost: 7800, categoryId: catJuices.id, isActive: true,
    },
  });
  const productJuiceOrange = await prisma.product.create({
    data: {
      id: uuidv7(), name: 'Сок апельсиновый', sku: 'JCE-002', barcode: '4600000000099',
      unit: 'л', price: 13500, cost: 8200, categoryId: catJuices.id, isActive: true,
    },
  });

  console.log('  ✅ Products: 10 products + 3 variants');

  // ═══════════════════════════════════════════
  //  6. Склады и остатки
  // ═══════════════════════════════════════════

  const mainStore = await prisma.warehouse.create({
    data: { id: uuidv7(), name: 'Основной склад', address: 'ул. Промышленная, д. 1', isActive: true },
  });
  const retailStore = await prisma.warehouse.create({
    data: { id: uuidv7(), name: 'Магазин "Центральный"', address: 'ул. Ленина, д. 25', isActive: true },
  });

  console.log('  ✅ Warehouses: 2');

  // Остатки
  const allProducts = [productBread, productBaguette, productCroissant, productMilk3, productMilk15,
    productCheeseRussian, productCheeseParm, productJuiceApple, productJuiceOrange];

  const stockData = allProducts.flatMap((p) => [
    { productId: p.id, warehouseId: mainStore.id, quantity: Math.floor(Math.random() * 80) + 20, minStock: 10, maxStock: 100 },
    { productId: p.id, warehouseId: retailStore.id, quantity: Math.floor(Math.random() * 30) + 5, minStock: 5, maxStock: 50 },
  ]);

  for (const s of stockData) {
    await prisma.stockItem.upsert({
      where: { productId_warehouseId: { productId: s.productId, warehouseId: s.warehouseId } },
      update: {},
      create: { id: uuidv7(), ...s },
    });
  }

  // Движения (IN — начальное оприходование)
  for (const s of stockData) {
    await prisma.stockMovement.create({
      data: {
        id: uuidv7(), productId: s.productId, warehouseId: s.warehouseId,
        type: 'IN' as MovementType, quantity: s.quantity, notes: 'Начальный остаток',
        userId: admin.id,
      },
    });
  }

  console.log('  ✅ Stock items & movements created');

  // ═══════════════════════════════════════════
  //  7. Финансы: счета
  // ═══════════════════════════════════════════

  const cashAccount = await prisma.account.create({
    data: { id: uuidv7(), name: 'Касса магазина', type: 'CASH' as AccountType, balance: 5000000, currency: 'RUB', isActive: true },
  });
  const bankAccount = await prisma.account.create({
    data: { id: uuidv7(), name: 'Расчётный счёт', type: 'BANK' as AccountType, balance: 15000000, currency: 'RUB', isActive: true },
  });
  const revenueAccount = await prisma.account.create({
    data: { id: uuidv7(), name: 'Выручка', type: 'REVENUE' as AccountType, balance: 0, currency: 'RUB', isActive: true },
  });
  const expenseAccount = await prisma.account.create({
    data: { id: uuidv7(), name: 'Расходы', type: 'EXPENSE' as AccountType, balance: 0, currency: 'RUB', isActive: true },
  });

  console.log('  ✅ Accounts: 4');

  // ═══════════════════════════════════════════
  //  8. Продажи (тестовый набор)
  // ═══════════════════════════════════════════

  const now = new Date();

  // Продажа #1 — прямая
  const sale1 = await prisma.sale.create({
    data: {
      id: uuidv7(), number: 'ORD-20260620-000001',
      customerId: customers[0].id, date: new Date(now.getTime() - 7200000),
      subtotal: 35000, discount: 0, total: 35000, status: 'COMPLETED' as SaleStatus,
      userId: cashier.id,
      items: {
        create: [
          { id: uuidv7(), productId: productCroissant.id, quantity: 2, unitPrice: 8900, discount: 0, total: 17800 },
          { id: uuidv7(), productId: productJuiceApple.id, quantity: 1, unitPrice: 12500, discount: 0, total: 12500 },
          { id: uuidv7(), productId: productBaguette.id, quantity: 1, unitPrice: 4500, discount: 0, total: 4500 },
        ],
      },
      payments: {
        create: [
          { id: uuidv7(), amount: 35000, method: 'CARD' as PaymentMethod, status: 'COMPLETED' as PaymentStatus },
        ],
      },
    },
    include: { items: true, payments: true },
  });

  console.log(`  ✅ Sale #1: ${sale1.number}, ${sale1.total / 100} руб`);

  // Продажа #2 — сікидкой
  const sale2 = await prisma.sale.create({
    data: {
      id: uuidv7(), number: 'ORD-20260620-000002',
      customerId: customers[1].id, date: new Date(now.getTime() - 3600000),
      subtotal: 89900, discount: 8990, total: 80910, status: 'CONFIRMED' as SaleStatus,
      userId: cashier.id,
      items: {
        create: [
          { id: uuidv7(), productId: productCheeseRussian.id, quantity: 1, unitPrice: 89900, discount: 8990, total: 80910 },
        ],
      },
      payments: {
        create: [
          { id: uuidv7(), amount: 80910, method: 'CASH' as PaymentMethod, status: 'COMPLETED' as PaymentStatus },
        ],
      },
    },
    include: { items: true, payments: true },
  });

  console.log(`  ✅ Sale #2: ${sale2.number}, ${sale2.total / 100} руб (discount 10%)`);

  // Продажа #3 — без клиента
  const sale3 = await prisma.sale.create({
    data: {
      id: uuidv7(), number: 'ORD-20260620-000003',
      date: new Date(now.getTime() - 1800000),
      subtotal: 21000, discount: 0, total: 21000, status: 'COMPLETED' as SaleStatus,
      userId: cashier.id,
      items: {
        create: [
          { id: uuidv7(), productId: productMilk3.id, quantity: 2, unitPrice: 7500, discount: 0, total: 15000 },
          { id: uuidv7(), productId: productBread.id, quantity: 1, unitPrice: 6500, discount: 0, total: 6500 },
        ],
      },
      payments: {},
    },
    include: { items: true },
  });

  console.log(`  ✅ Sale #3: ${sale3.number}, ${sale3.total / 100} руб (без оплаты)`);

  // ═══════════════════════════════════════════
  //  9. Счета-фактуры
  // ═══════════════════════════════════════════

  const invoice1 = await prisma.invoice.create({
    data: {
      id: uuidv7(), number: 'INV-202606-000001',
      customerId: customers[1].id, saleId: sale2.id,
      date: now, dueDate: new Date(now.getTime() + 30 * 86400000),
      subtotal: 89900, tax: 17980, total: 107880, status: 'SENT' as InvoiceStatus,
    },
  });
  const invoice2 = await prisma.invoice.create({
    data: {
      id: uuidv7(), number: 'INV-202606-000002',
      customerId: customers[0].id,
      date: now, dueDate: new Date(now.getTime() + 14 * 86400000),
      subtotal: 50000, tax: 10000, total: 60000, status: 'PAID' as InvoiceStatus,
    },
  });

  console.log(`  ✅ Invoices: 2 created`);

  // ═══════════════════════════════════════════
  //  10. Метрики дашборда (инициализация)
  // ═══════════════════════════════════════════

  const metrics = [
    { id: uuidv7(), key: 'today_revenue', value: sale1.total + sale2.total + sale3.total },
    { id: uuidv7(), key: 'today_orders', value: 2 }, // 2 completed
    { id: uuidv7(), key: 'accounts_receivable', value: invoice2.total },
  ];
  for (const m of metrics) {
    await prisma.dashboardMetric.upsert({
      where: { key: m.key },
      update: { value: m.value },
      create: m,
    });
  }

  console.log('  ✅ Dashboard metrics: 3 initialized\n');

  // ═══════════════════════════════════════════
  //  Финиш
  // ═══════════════════════════════════════════

  console.log('🎉 Seed complete!');
  console.log('─────────────────────');
  console.log(`Users:       4`);
  console.log(`Groups:      3`);
  console.log(`Customers:   ${customers.length}`);
  console.log(`Categories:  8`);
  console.log(`Products:    ${allProducts.length}`);
  console.log(`Variants:    3`);
  console.log(`Warehouses:  2`);
  console.log(`Sales:       3`);
  console.log(`Invoices:    2`);
  console.log(`Accounts:    4`);
  console.log('─────────────────────');
  console.log('\nLogin creds: ALL users / password\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
