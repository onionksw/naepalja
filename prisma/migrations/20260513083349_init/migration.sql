-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SajuInfo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "birthDate" TEXT NOT NULL,
    "birthTime" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "isLunar" BOOLEAN NOT NULL DEFAULT false,
    "yearGan" TEXT NOT NULL,
    "yearJi" TEXT NOT NULL,
    "monthGan" TEXT NOT NULL,
    "monthJi" TEXT NOT NULL,
    "dayGan" TEXT NOT NULL,
    "dayJi" TEXT NOT NULL,
    "hourGan" TEXT NOT NULL,
    "hourJi" TEXT NOT NULL,
    CONSTRAINT "SajuInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyFortune" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "fortuneDate" TEXT NOT NULL,
    "totalLuck" TEXT NOT NULL,
    "workLuck" TEXT NOT NULL,
    "loveLuck" TEXT NOT NULL,
    "healthLuck" TEXT NOT NULL,
    "caution" TEXT NOT NULL,
    "luckyColor" TEXT NOT NULL,
    "luckyNumber" TEXT NOT NULL,
    "luckyItem" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyFortune_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SajuReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "daymaster" TEXT NOT NULL,
    "ohaengScore" TEXT NOT NULL,
    "yongsin" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SajuReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Manjuryok" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "solarDate" TEXT NOT NULL,
    "lunarDate" TEXT NOT NULL,
    "yearGan" TEXT NOT NULL,
    "yearJi" TEXT NOT NULL,
    "monthGan" TEXT NOT NULL,
    "monthJi" TEXT NOT NULL,
    "dayGan" TEXT NOT NULL,
    "dayJi" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SajuInfo_userId_key" ON "SajuInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyFortune_userId_fortuneDate_key" ON "DailyFortune"("userId", "fortuneDate");

-- CreateIndex
CREATE UNIQUE INDEX "SajuReport_userId_key" ON "SajuReport"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Manjuryok_solarDate_key" ON "Manjuryok"("solarDate");
