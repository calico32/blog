-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "day" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "content" BYTEA,
    "articleYear" INTEGER,
    "articleMonth" INTEGER,
    "articleDay" INTEGER,
    "articleSlug" TEXT,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_year_month_day_slug_key" ON "Article"("year", "month", "day", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_articleYear_articleMonth_articleDay_articleSlug__key" ON "Attachment"("articleYear", "articleMonth", "articleDay", "articleSlug", "name");

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_articleYear_articleMonth_articleDay_articleSlug_fkey" FOREIGN KEY ("articleYear", "articleMonth", "articleDay", "articleSlug") REFERENCES "Article"("year", "month", "day", "slug") ON DELETE SET NULL ON UPDATE CASCADE;
