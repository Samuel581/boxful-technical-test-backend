import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = 'Password123';

async function main() {
  console.log('Wiping database...');
  await prisma.package.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  console.log('Database wiped.');

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // ── Users ──────────────────────────────────────────────
  console.log('Creating users...');

  const carlos = await prisma.user.create({
    data: {
      firstnames: 'Carlos Alberto',
      lastnames: 'Martínez López',
      sex: 'M',
      borndate: new Date('1992-03-15T00:00:00.000Z'),
      email: 'carlos.martinez@example.com',
      phone: '+50378001234',
      password: hashedPassword,
    },
  });

  const maria = await prisma.user.create({
    data: {
      firstnames: 'María José',
      lastnames: 'García Hernández',
      sex: 'F',
      borndate: new Date('1988-11-22T00:00:00.000Z'),
      email: 'maria.garcia@example.com',
      phone: '+50376005678',
      password: hashedPassword,
    },
  });

  const alex = await prisma.user.create({
    data: {
      firstnames: 'Alex',
      lastnames: 'Rivera Santos',
      sex: 'OTHER',
      borndate: new Date('1995-07-08T00:00:00.000Z'),
      email: 'alex.rivera@example.com',
      phone: '+50372009012',
      password: hashedPassword,
    },
  });

  const sofia = await prisma.user.create({
    data: {
      firstnames: 'Sofía',
      lastnames: 'Flores Morales',
      sex: 'F',
      borndate: new Date('2000-01-30T00:00:00.000Z'),
      email: 'sofia.flores@example.com',
      phone: '+50371003456',
      password: hashedPassword,
    },
  });

  const diego = await prisma.user.create({
    data: {
      firstnames: 'Diego Armando',
      lastnames: 'Ramos Castillo',
      sex: 'M',
      borndate: new Date('1985-05-10T00:00:00.000Z'),
      email: 'diego.ramos@example.com',
      phone: '+50374007890',
      password: hashedPassword,
    },
  });

  console.log('Created 5 users.');

  // ── Orders ─────────────────────────────────────────────
  console.log('Creating orders...');

  // Carlos — 6 orders (spread across months for date filtering)
  await prisma.order.create({
    data: {
      userId: carlos.id,
      recolectionAddress: 'Colonia Escalón, Calle El Mirador #123, San Salvador',
      programedDate: new Date('2025-02-10T09:00:00.000Z'),
      recipientNames: 'Ana Lucía',
      recipientLastNames: 'Vásquez Díaz',
      recipientEmail: 'ana.vasquez@example.com',
      recipientCellphone: '+50375001111',
      destinationAddress: 'Residencial Las Magnolias, Casa #45, Santa Tecla',
      state: 'La Libertad',
      city: 'Santa Tecla',
      referencePoint: 'Across from the green pharmacy',
      additionalInstructions: 'Ring the bell twice',
      status: 'DELIVERED',
      createdAt: new Date('2025-01-15T08:30:00.000Z'),
      packages: {
        create: [
          { weight: 2.5, content: 'Books — Spanish literature', height: 10, length: 30, width: 20 },
          { weight: 1.0, content: 'Notebook and pens', height: 5, length: 25, width: 18 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: carlos.id,
      recolectionAddress: 'Boulevard Los Héroes #456, San Salvador',
      programedDate: new Date('2025-03-20T14:00:00.000Z'),
      recipientNames: 'Pedro',
      recipientLastNames: 'Mejía Torres',
      recipientEmail: 'pedro.mejia@example.com',
      recipientCellphone: '+50376002222',
      destinationAddress: 'Colonia San Benito, Avenida La Revolución #78',
      state: 'San Salvador',
      city: 'San Salvador',
      referencePoint: 'Next to the Italian restaurant',
      status: 'DELIVERED',
      createdAt: new Date('2025-03-05T10:00:00.000Z'),
      packages: {
        create: [
          { weight: 8.0, content: 'Electronics — Laptop', height: 5, length: 40, width: 30 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: carlos.id,
      recolectionAddress: 'Colonia Escalón, Calle El Mirador #123, San Salvador',
      programedDate: new Date('2025-05-15T11:00:00.000Z'),
      recipientNames: 'Laura',
      recipientLastNames: 'Pineda Guzmán',
      recipientEmail: 'laura.pineda@example.com',
      recipientCellphone: '+50377003333',
      destinationAddress: 'Urbanización Madre Selva, Casa #12, Antiguo Cuscatlán',
      state: 'La Libertad',
      city: 'Antiguo Cuscatlán',
      referencePoint: 'Behind the university campus',
      additionalInstructions: 'Fragile — handle with care',
      status: 'IN_TRANSIT',
      createdAt: new Date('2025-05-01T15:00:00.000Z'),
      packages: {
        create: [
          { weight: 3.0, content: 'Ceramic vase', height: 40, length: 20, width: 20 },
          { weight: 1.5, content: 'Picture frame', height: 50, length: 40, width: 5 },
          { weight: 0.5, content: 'Greeting card box', height: 10, length: 15, width: 10 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: carlos.id,
      recolectionAddress: 'Centro Comercial La Gran Vía, local 201',
      programedDate: new Date('2025-06-25T10:00:00.000Z'),
      recipientNames: 'Roberto',
      recipientLastNames: 'Orellana Campos',
      recipientEmail: 'roberto.orellana@example.com',
      recipientCellphone: '+50378004444',
      destinationAddress: 'Colonia Maquilishuat, Pasaje 3, Casa #7',
      state: 'San Salvador',
      city: 'San Salvador',
      referencePoint: 'Near the yellow church',
      status: 'PENDING',
      createdAt: new Date('2025-06-20T09:00:00.000Z'),
      packages: {
        create: [
          { weight: 12.0, content: 'Car spare parts', height: 30, length: 50, width: 40 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: carlos.id,
      recolectionAddress: 'Colonia Escalón, Calle El Mirador #123, San Salvador',
      programedDate: new Date('2025-07-10T16:00:00.000Z'),
      recipientNames: 'Daniela',
      recipientLastNames: 'Reyes Aguilar',
      recipientEmail: 'daniela.reyes@example.com',
      recipientCellphone: '+50379005555',
      destinationAddress: 'Residencial Utila, Block C, Apt 4B',
      state: 'La Libertad',
      city: 'Santa Tecla',
      referencePoint: 'Entrance by the parking lot',
      additionalInstructions: 'Leave with the security guard if not home',
      status: 'PENDING',
      createdAt: new Date('2025-07-01T12:00:00.000Z'),
      packages: {
        create: [
          { weight: 0.8, content: 'Clothing — T-shirts', height: 10, length: 30, width: 25 },
          { weight: 0.3, content: 'Accessories — Sunglasses', height: 8, length: 15, width: 8 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: carlos.id,
      recolectionAddress: 'Boulevard Los Héroes #456, San Salvador',
      programedDate: new Date('2025-07-20T08:00:00.000Z'),
      recipientNames: 'Fernando',
      recipientLastNames: 'Cruz Molina',
      recipientEmail: 'fernando.cruz@example.com',
      recipientCellphone: '+50370006666',
      destinationAddress: 'Colonia Miramonte, Calle Principal #90',
      state: 'San Salvador',
      city: 'San Salvador',
      referencePoint: 'Corner house with blue gate',
      status: 'CANCELLED',
      createdAt: new Date('2025-07-10T07:00:00.000Z'),
      packages: {
        create: [
          { weight: 5.0, content: 'Kitchen appliance — Blender', height: 35, length: 20, width: 20 },
        ],
      },
    },
  });

  // María — 5 orders
  await prisma.order.create({
    data: {
      userId: maria.id,
      recolectionAddress: 'Colonia Médica, Avenida Max Bloch #34, San Salvador',
      programedDate: new Date('2025-02-05T10:00:00.000Z'),
      recipientNames: 'Claudia',
      recipientLastNames: 'Portillo Rivas',
      recipientEmail: 'claudia.portillo@example.com',
      recipientCellphone: '+50371007777',
      destinationAddress: 'Colonia Flor Blanca, 25 Calle Poniente #15',
      state: 'San Salvador',
      city: 'San Salvador',
      referencePoint: 'Next to the bakery',
      status: 'DELIVERED',
      createdAt: new Date('2025-01-28T11:00:00.000Z'),
      packages: {
        create: [
          { weight: 1.2, content: 'Skincare products', height: 15, length: 20, width: 15 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: maria.id,
      recolectionAddress: 'Centro de San Salvador, 4ta Calle Oriente #56',
      programedDate: new Date('2025-04-12T13:00:00.000Z'),
      recipientNames: 'Jorge',
      recipientLastNames: 'Alvarado Peña',
      recipientEmail: 'jorge.alvarado@example.com',
      recipientCellphone: '+50372008888',
      destinationAddress: 'Ciudad Merliot, Calle L-3 #22',
      state: 'La Libertad',
      city: 'Ciudad Merliot',
      referencePoint: 'White house with red roof',
      additionalInstructions: 'Call before arriving',
      status: 'DELIVERED',
      createdAt: new Date('2025-04-01T09:00:00.000Z'),
      packages: {
        create: [
          { weight: 6.5, content: 'Home decoration — Wall art', height: 60, length: 80, width: 5 },
          { weight: 2.0, content: 'Candle set', height: 15, length: 30, width: 20 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: maria.id,
      recolectionAddress: 'Colonia Médica, Avenida Max Bloch #34, San Salvador',
      programedDate: new Date('2025-05-28T09:00:00.000Z'),
      recipientNames: 'Isabella',
      recipientLastNames: 'Romero Figueroa',
      recipientEmail: 'isabella.romero@example.com',
      recipientCellphone: '+50373009999',
      destinationAddress: 'Residencial Altos de la Escalón, Torre 2, Apt 8C',
      state: 'San Salvador',
      city: 'San Salvador',
      referencePoint: 'Main entrance, tell the guard the apartment number',
      status: 'IN_TRANSIT',
      createdAt: new Date('2025-05-20T14:00:00.000Z'),
      packages: {
        create: [
          { weight: 4.0, content: 'Yoga equipment', height: 15, length: 65, width: 15 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: maria.id,
      recolectionAddress: 'Centro de San Salvador, 4ta Calle Oriente #56',
      programedDate: new Date('2025-06-18T11:00:00.000Z'),
      recipientNames: 'Miguel',
      recipientLastNames: 'Sandoval Barrera',
      recipientEmail: 'miguel.sandoval@example.com',
      recipientCellphone: '+50374001010',
      destinationAddress: 'Colonia Layco, Pasaje Los Pinos #3',
      state: 'San Salvador',
      city: 'San Salvador',
      referencePoint: 'Behind the gas station',
      status: 'PENDING',
      createdAt: new Date('2025-06-10T16:00:00.000Z'),
      packages: {
        create: [
          { weight: 3.5, content: 'Board games collection', height: 20, length: 40, width: 30 },
          { weight: 1.0, content: 'Playing cards set', height: 5, length: 10, width: 8 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: maria.id,
      recolectionAddress: 'Colonia Médica, Avenida Max Bloch #34, San Salvador',
      programedDate: new Date('2025-07-05T15:00:00.000Z'),
      recipientNames: 'Gabriela',
      recipientLastNames: 'Navarrete Sosa',
      recipientEmail: 'gabriela.navarrete@example.com',
      recipientCellphone: '+50375001111',
      destinationAddress: 'San Marcos, Calle al Volcán #67',
      state: 'San Salvador',
      city: 'San Marcos',
      referencePoint: 'At the end of the street',
      additionalInstructions: 'Do not bend the package',
      status: 'PENDING',
      createdAt: new Date('2025-07-02T10:00:00.000Z'),
      packages: {
        create: [
          { weight: 0.5, content: 'Documents and certificates', height: 2, length: 35, width: 25 },
        ],
      },
    },
  });

  // Alex — 4 orders
  await prisma.order.create({
    data: {
      userId: alex.id,
      recolectionAddress: 'Colonia San Francisco, Calle El Progreso #89, San Salvador',
      programedDate: new Date('2025-03-10T10:00:00.000Z'),
      recipientNames: 'Valeria',
      recipientLastNames: 'Mendoza Cruz',
      recipientEmail: 'valeria.mendoza@example.com',
      recipientCellphone: '+50376002222',
      destinationAddress: 'Soyapango, Reparto Las Margaritas, Casa #14',
      state: 'San Salvador',
      city: 'Soyapango',
      referencePoint: 'Near the football field',
      status: 'DELIVERED',
      createdAt: new Date('2025-02-25T08:00:00.000Z'),
      packages: {
        create: [
          { weight: 7.0, content: 'Computer monitor', height: 40, length: 60, width: 15 },
          { weight: 1.5, content: 'HDMI cables and adapters', height: 5, length: 20, width: 15 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: alex.id,
      recolectionAddress: 'Colonia San Francisco, Calle El Progreso #89, San Salvador',
      programedDate: new Date('2025-04-22T14:00:00.000Z'),
      recipientNames: 'Andrés',
      recipientLastNames: 'Fuentes Zelaya',
      recipientEmail: 'andres.fuentes@example.com',
      recipientCellphone: '+50377003333',
      destinationAddress: 'Ilopango, Residencial Altavista, Block B, Casa #5',
      state: 'San Salvador',
      city: 'Ilopango',
      referencePoint: 'Second entrance on the right',
      additionalInstructions: 'Deliver between 2pm and 5pm only',
      status: 'DELIVERED',
      createdAt: new Date('2025-04-15T11:00:00.000Z'),
      packages: {
        create: [
          { weight: 2.0, content: 'Headphones and microphone', height: 20, length: 25, width: 20 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: alex.id,
      recolectionAddress: 'Plaza Mundo, local 305, Soyapango',
      programedDate: new Date('2025-06-08T09:00:00.000Z'),
      recipientNames: 'Camila',
      recipientLastNames: 'Argueta Bonilla',
      recipientEmail: 'camila.argueta@example.com',
      recipientCellphone: '+50378004444',
      destinationAddress: 'Mejicanos, Colonia Zacamil, Edificio C, Apt 302',
      state: 'San Salvador',
      city: 'Mejicanos',
      referencePoint: 'Main entrance of the building complex',
      status: 'IN_TRANSIT',
      createdAt: new Date('2025-06-01T13:00:00.000Z'),
      packages: {
        create: [
          { weight: 4.5, content: 'Printer', height: 25, length: 45, width: 35 },
          { weight: 3.0, content: 'Printer paper — 5 reams', height: 25, length: 30, width: 22 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: alex.id,
      recolectionAddress: 'Colonia San Francisco, Calle El Progreso #89, San Salvador',
      programedDate: new Date('2025-07-15T11:00:00.000Z'),
      recipientNames: 'Emilio',
      recipientLastNames: 'Vega Quintanilla',
      recipientEmail: 'emilio.vega@example.com',
      recipientCellphone: '+50379005555',
      destinationAddress: 'Apopa, Lotificación El Carmen, Casa #28',
      state: 'San Salvador',
      city: 'Apopa',
      referencePoint: 'Ask at the corner store',
      status: 'PENDING',
      createdAt: new Date('2025-07-08T17:00:00.000Z'),
      packages: {
        create: [
          { weight: 0.3, content: 'USB drives — pack of 10', height: 3, length: 15, width: 10 },
        ],
      },
    },
  });

  // Sofía — 4 orders
  await prisma.order.create({
    data: {
      userId: sofia.id,
      recolectionAddress: 'Metrocentro San Salvador, local 115',
      programedDate: new Date('2025-03-18T10:00:00.000Z'),
      recipientNames: 'Natalia',
      recipientLastNames: 'Escobar Palacios',
      recipientEmail: 'natalia.escobar@example.com',
      recipientCellphone: '+50370006666',
      destinationAddress: 'Colonia Centroamérica, Calle Los Almendros #33',
      state: 'San Salvador',
      city: 'San Salvador',
      referencePoint: 'Two blocks from the park',
      status: 'DELIVERED',
      createdAt: new Date('2025-03-10T09:00:00.000Z'),
      packages: {
        create: [
          { weight: 1.8, content: 'Handmade jewelry collection', height: 8, length: 20, width: 15 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: sofia.id,
      recolectionAddress: 'Colonia Roma, Pasaje 5 #12, San Salvador',
      programedDate: new Date('2025-05-05T13:00:00.000Z'),
      recipientNames: 'Sebastián',
      recipientLastNames: 'Linares Chávez',
      recipientEmail: 'sebastian.linares@example.com',
      recipientCellphone: '+50371007777',
      destinationAddress: 'Planes de Renderos, Km 8, Casa #3',
      state: 'San Salvador',
      city: 'Panchimalco',
      referencePoint: 'Right after the viewpoint',
      additionalInstructions: 'Call when 10 minutes away — dirt road access',
      status: 'CANCELLED',
      createdAt: new Date('2025-04-28T15:00:00.000Z'),
      packages: {
        create: [
          { weight: 10.0, content: 'Camping tent', height: 20, length: 60, width: 20 },
          { weight: 3.0, content: 'Sleeping bags — 2 units', height: 30, length: 40, width: 30 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: sofia.id,
      recolectionAddress: 'Metrocentro San Salvador, local 115',
      programedDate: new Date('2025-06-30T10:00:00.000Z'),
      recipientNames: 'Luciana',
      recipientLastNames: 'Osorio Martínez',
      recipientEmail: 'luciana.osorio@example.com',
      recipientCellphone: '+50372008888',
      destinationAddress: 'Colonia Miralvalle, Calle Principal #55',
      state: 'San Salvador',
      city: 'San Salvador',
      referencePoint: 'Orange building at the corner',
      status: 'PENDING',
      createdAt: new Date('2025-06-25T08:00:00.000Z'),
      packages: {
        create: [
          { weight: 2.5, content: 'Art supplies — paint and brushes', height: 10, length: 35, width: 25 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: sofia.id,
      recolectionAddress: 'Colonia Roma, Pasaje 5 #12, San Salvador',
      programedDate: new Date('2025-07-22T09:00:00.000Z'),
      recipientNames: 'Mateo',
      recipientLastNames: 'Calderón Benítez',
      recipientEmail: 'mateo.calderon@example.com',
      recipientCellphone: '+50373009999',
      destinationAddress: 'Tonacatepeque, Residencial Bosques de la Paz, Casa #19',
      state: 'San Salvador',
      city: 'Tonacatepeque',
      referencePoint: 'First house after the speed bump',
      status: 'PENDING',
      createdAt: new Date('2025-07-15T14:00:00.000Z'),
      packages: {
        create: [
          { weight: 1.0, content: 'Stationery gift set', height: 5, length: 25, width: 20 },
          { weight: 0.8, content: 'Planner and stickers', height: 3, length: 28, width: 22 },
        ],
      },
    },
  });

  // Diego — 5 orders
  await prisma.order.create({
    data: {
      userId: diego.id,
      recolectionAddress: 'Zona Industrial Plan de La Laguna, Bodega 12',
      programedDate: new Date('2025-01-25T08:00:00.000Z'),
      recipientNames: 'Ricardo',
      recipientLastNames: 'Cáceres Monge',
      recipientEmail: 'ricardo.caceres@example.com',
      recipientCellphone: '+50374001010',
      destinationAddress: 'Santa Ana, Colonia El Palmar, Avenida 3 #42',
      state: 'Santa Ana',
      city: 'Santa Ana',
      referencePoint: 'Behind the cathedral',
      additionalInstructions: 'Heavy items — bring dolly',
      status: 'DELIVERED',
      createdAt: new Date('2025-01-20T07:00:00.000Z'),
      packages: {
        create: [
          { weight: 25.0, content: 'Industrial tools', height: 40, length: 60, width: 40 },
          { weight: 15.0, content: 'Metal brackets — box of 50', height: 20, length: 40, width: 30 },
          { weight: 8.0, content: 'Safety equipment — helmets and gloves', height: 30, length: 40, width: 35 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: diego.id,
      recolectionAddress: 'Zona Industrial Plan de La Laguna, Bodega 12',
      programedDate: new Date('2025-03-30T07:00:00.000Z'),
      recipientNames: 'Patricia',
      recipientLastNames: 'Henríquez Dubón',
      recipientEmail: 'patricia.henriquez@example.com',
      recipientCellphone: '+50375002020',
      destinationAddress: 'San Miguel, Barrio El Centro, 2da Calle Poniente #18',
      state: 'San Miguel',
      city: 'San Miguel',
      referencePoint: 'Near the central market',
      status: 'DELIVERED',
      createdAt: new Date('2025-03-22T10:00:00.000Z'),
      packages: {
        create: [
          { weight: 18.0, content: 'Power tools — drill and saw', height: 35, length: 50, width: 35 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: diego.id,
      recolectionAddress: 'Boulevard del Ejército, Km 4.5, San Salvador',
      programedDate: new Date('2025-05-20T09:00:00.000Z'),
      recipientNames: 'Oscar',
      recipientLastNames: 'Landaverde Flores',
      recipientEmail: 'oscar.landaverde@example.com',
      recipientCellphone: '+50376003030',
      destinationAddress: 'Usulután, Colonia Las Palmeras, Casa #8',
      state: 'Usulután',
      city: 'Usulután',
      referencePoint: 'Across from the school',
      status: 'IN_TRANSIT',
      createdAt: new Date('2025-05-15T13:00:00.000Z'),
      packages: {
        create: [
          { weight: 6.0, content: 'Plumbing supplies', height: 25, length: 40, width: 30 },
          { weight: 4.0, content: 'PVC pipes — assorted', height: 10, length: 100, width: 10 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: diego.id,
      recolectionAddress: 'Zona Industrial Plan de La Laguna, Bodega 12',
      programedDate: new Date('2025-06-15T08:00:00.000Z'),
      recipientNames: 'Carmen',
      recipientLastNames: 'Ramírez Solano',
      recipientEmail: 'carmen.ramirez@example.com',
      recipientCellphone: '+50377004040',
      destinationAddress: 'La Unión, Barrio Concepción, Calle Principal #5',
      state: 'La Unión',
      city: 'La Unión',
      referencePoint: 'Next to the port entrance',
      additionalInstructions: 'Deliver before noon — closes at 12pm',
      status: 'PENDING',
      createdAt: new Date('2025-06-08T11:00:00.000Z'),
      packages: {
        create: [
          { weight: 20.0, content: 'Construction materials — cement bags', height: 30, length: 50, width: 30 },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: diego.id,
      recolectionAddress: 'Boulevard del Ejército, Km 4.5, San Salvador',
      programedDate: new Date('2025-07-25T10:00:00.000Z'),
      recipientNames: 'Eduardo',
      recipientLastNames: 'Zelaya Cornejo',
      recipientEmail: 'eduardo.zelaya@example.com',
      recipientCellphone: '+50378005050',
      destinationAddress: 'Chalatenango, Colonia La Esperanza, Casa #31',
      state: 'Chalatenango',
      city: 'Chalatenango',
      referencePoint: 'Last house on the hill',
      status: 'PENDING',
      createdAt: new Date('2025-07-18T09:00:00.000Z'),
      packages: {
        create: [
          { weight: 9.0, content: 'Generator parts', height: 30, length: 45, width: 35 },
          { weight: 5.0, content: 'Electrical wiring — 100m roll', height: 25, length: 25, width: 25 },
        ],
      },
    },
  });

  console.log('Seed complete!');
  console.log('────────────────────────────────────────');
  console.log('5 users created (all with password: "Password123")');
  console.log('24 orders created with 35 packages total');
  console.log('');
  console.log('Test accounts:');
  console.log('  carlos.martinez@example.com  (6 orders)');
  console.log('  maria.garcia@example.com     (5 orders)');
  console.log('  alex.rivera@example.com      (4 orders)');
  console.log('  sofia.flores@example.com     (4 orders)');
  console.log('  diego.ramos@example.com      (5 orders)');
  console.log('────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
