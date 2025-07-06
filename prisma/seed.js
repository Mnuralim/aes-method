const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");
const CryptoJS = require("crypto-js");

const prisma = new PrismaClient();

const AES_KEY = CryptoJS.enc.Utf8.parse(
  process.env.AES_KEY || "1234567890123456"
);
const IV = CryptoJS.enc.Utf8.parse(process.env.AES_IV || "abcdef9876543210");

function encryptAES(text) {
  const encrypted = CryptoJS.AES.encrypt(text, AES_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return encrypted;
}

async function createAdmin() {
  console.log("Seeding admin...");

  const defaultAdmin = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME,
  };

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: defaultAdmin.username },
  });

  if (!existingAdmin) {
    const hashedPassword = await hash(defaultAdmin.password, 10);

    await prisma.admin.create({
      data: {
        username: defaultAdmin.username,
        password: hashedPassword,
        name: encryptAES(defaultAdmin.name),
      },
    });

    console.log("Admin seeded successfully!");
  } else {
    console.log("Admin already exists. Skipping seeding.");
  }
}

async function createResidents() {
  console.log("Seeding residents...");

  const familyCards = await prisma.familyCard.findMany();

  const residents = [
    {
      nik: "3201010101850001",
      name: "Ahmad Suryadi",
      phone: "081234567890",
      address:
        "Jl. Merdeka No. 10, RT 01/RW 02, Kelurahan Sukamaju, Kecamatan Cikarang Utara",
      birthDate: "1985-01-15",
      birthPlace: "Jakarta",
      religion: "Islam",
      gender: "Laki-laki",
      occupation: "Karyawan Swasta",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101870002",
      name: "Siti Nurhaliza",
      phone: "081234567891",
      address:
        "Jl. Merdeka No. 10, RT 01/RW 02, Kelurahan Sukamaju, Kecamatan Cikarang Utara",
      birthDate: "1987-03-20",
      birthPlace: "Bandung",
      religion: "Islam",
      gender: "Perempuan",
      occupation: "Ibu Rumah Tangga",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101800003",
      name: "Budi Santoso",
      phone: "081234567892",
      address:
        "Jl. Pancasila No. 25, RT 03/RW 04, Kelurahan Karang Asem, Kecamatan Cikarang Selatan",
      birthDate: "1980-05-10",
      birthPlace: "Surabaya",
      religion: "Kristen",
      gender: "Laki-laki",
      occupation: "Guru",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101820004",
      name: "Rina Kusuma",
      phone: "081234567893",
      address:
        "Jl. Pancasila No. 25, RT 03/RW 04, Kelurahan Karang Asem, Kecamatan Cikarang Selatan",
      birthDate: "1982-08-25",
      birthPlace: "Yogyakarta",
      religion: "Kristen",
      gender: "Perempuan",
      occupation: "Perawat",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101880005",
      name: "Chandra Wijaya",
      phone: "081234567894",
      address:
        "Jl. Diponegoro No. 8, RT 02/RW 01, Kelurahan Wangunharja, Kecamatan Cikarang Utara",
      birthDate: "1988-12-05",
      birthPlace: "Medan",
      religion: "Buddha",
      gender: "Laki-laki",
      occupation: "Pengusaha",
      maritalStatus: "Belum Menikah",
    },
    {
      nik: "3201010101900006",
      name: "Dewi Sartika",
      phone: "081234567895",
      address:
        "Jl. Kartini No. 15, RT 04/RW 03, Kelurahan Lippo Cikarang, Kecamatan Cikarang Utara",
      birthDate: "1990-02-14",
      birthPlace: "Semarang",
      religion: "Islam",
      gender: "Perempuan",
      occupation: "Dokter",
      maritalStatus: "Belum Menikah",
    },
    {
      nik: "3201010101850007",
      name: "Eko Prasetyo",
      phone: "081234567896",
      address:
        "Jl. Sudirman No. 30, RT 01/RW 05, Kelurahan Cikarang Kota, Kecamatan Cikarang Pusat",
      birthDate: "1985-07-30",
      birthPlace: "Solo",
      religion: "Islam",
      gender: "Laki-laki",
      occupation: "Polisi",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101920008",
      name: "Fitri Handayani",
      phone: "081234567897",
      address:
        "Jl. Thamrin No. 12, RT 05/RW 02, Kelurahan Sukamaju, Kecamatan Cikarang Barat",
      birthDate: "1992-04-18",
      birthPlace: "Palembang",
      religion: "Islam",
      gender: "Perempuan",
      occupation: "Farmasis",
      maritalStatus: "Belum Menikah",
    },
    {
      nik: "3201010101830009",
      name: "Gunawan Setiawan",
      phone: "081234567898",
      address:
        "Jl. Gatot Subroto No. 20, RT 02/RW 06, Kelurahan Karang Asem, Kecamatan Cikarang Timur",
      birthDate: "1983-11-22",
      birthPlace: "Makassar",
      religion: "Kristen",
      gender: "Laki-laki",
      occupation: "Insinyur",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101940010",
      name: "Heni Marlina",
      phone: "081234567899",
      address:
        "Jl. Ahmad Yani No. 5, RT 06/RW 01, Kelurahan Wangunharja, Kecamatan Cikarang Utara",
      birthDate: "1994-09-12",
      birthPlace: "Denpasar",
      religion: "Hindu",
      gender: "Perempuan",
      occupation: "Desainer Grafis",
      maritalStatus: "Belum Menikah",
    },
    {
      nik: "3201010101860011",
      name: "Indra Gunawan",
      phone: "081234567900",
      address:
        "Jl. Veteran No. 18, RT 03/RW 07, Kelurahan Lippo Cikarang, Kecamatan Cikarang Selatan",
      birthDate: "1986-06-08",
      birthPlace: "Balikpapan",
      religion: "Islam",
      gender: "Laki-laki",
      occupation: "Pilot",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101780012",
      name: "Joko Widodo",
      phone: "081234567901",
      address:
        "Jl. Pemuda No. 22, RT 07/RW 03, Kelurahan Cikarang Kota, Kecamatan Cikarang Pusat",
      birthDate: "1978-10-03",
      birthPlace: "Pontianak",
      religion: "Islam",
      gender: "Laki-laki",
      occupation: "Pegawai Negeri",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101910013",
      name: "Kartika Sari",
      phone: "081234567902",
      address:
        "Jl. Pahlawan No. 7, RT 04/RW 08, Kelurahan Sukamaju, Kecamatan Cikarang Barat",
      birthDate: "1991-01-28",
      birthPlace: "Manado",
      religion: "Kristen",
      gender: "Perempuan",
      occupation: "Akuntan",
      maritalStatus: "Belum Menikah",
    },
    {
      nik: "3201010101840014",
      name: "Lukman Hakim",
      phone: "081234567903",
      address:
        "Jl. Kemerdekaan No. 35, RT 08/RW 04, Kelurahan Karang Asem, Kecamatan Cikarang Timur",
      birthDate: "1984-03-16",
      birthPlace: "Padang",
      religion: "Islam",
      gender: "Laki-laki",
      occupation: "Chef",
      maritalStatus: "Menikah",
    },
    {
      nik: "3201010101890015",
      name: "Maya Sari",
      phone: "081234567904",
      address:
        "Jl. Proklamasi No. 14, RT 01/RW 09, Kelurahan Wangunharja, Kecamatan Cikarang Utara",
      birthDate: "1989-05-07",
      birthPlace: "Pekanbaru",
      religion: "Islam",
      gender: "Perempuan",
      occupation: "Psikolog",
      maritalStatus: "Belum Menikah",
    },
  ];

  for (const resident of residents) {
    const existing = await prisma.resident.findUnique({
      where: { nik: encryptAES(resident.nik) },
    });

    if (!existing) {
      await prisma.resident.create({
        data: {
          nik: encryptAES(resident.nik),
          name: encryptAES(resident.name),
          phone: encryptAES(resident.phone),
          address: encryptAES(resident.address),
          birthDate: encryptAES(resident.birthDate),
          birthPlace: encryptAES(resident.birthPlace),
          religion: encryptAES(resident.religion),
          gender: encryptAES(resident.gender),
          occupation: resident.occupation
            ? encryptAES(resident.occupation)
            : null,
          maritalStatus: resident.maritalStatus
            ? encryptAES(resident.maritalStatus)
            : null,
          familyCardId: resident.familyCardId,
        },
      });
    }
  }

  for (const familyCard of familyCards) {
    const memberCount = await prisma.resident.count({
      where: { familyCardId: familyCard.id },
    });

    await prisma.familyCard.update({
      where: { id: familyCard.id },
      data: { memberCount },
    });
  }

  console.log("Residents seeded successfully!");
}

async function main() {
  console.log("Starting seeding with AES encryption...");
  await createAdmin();
  await createResidents();
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
