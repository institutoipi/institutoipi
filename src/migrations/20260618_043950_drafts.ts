import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_posts_editorial_status" AS ENUM('draft', 'review', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');

  -- Move o "status" custom para o enum próprio, liberando "enum_posts_status".
  ALTER TABLE "posts" ALTER COLUMN "status" DROP DEFAULT;
  ALTER TABLE "posts" ALTER COLUMN "status" SET DATA TYPE "public"."enum_posts_editorial_status" USING "status"::text::"public"."enum_posts_editorial_status";
  ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'draft';
  ALTER TABLE "posts" ALTER COLUMN "status" DROP NOT NULL;

  -- Recria "enum_posts_status" com 2 valores para o "_status" nativo dos drafts.
  DROP TYPE "public"."enum_posts_status";
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  ALTER TABLE "posts" ADD COLUMN "_status" "enum_posts_status" DEFAULT 'draft';

  -- Drafts relaxam a obrigatoriedade (rascunhos podem estar incompletos).
  ALTER TABLE "posts" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "slug" DROP NOT NULL;

  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_cover_id" integer,
  	"version_category_id" integer,
  	"version_author_id" integer,
  	"version_status" "enum_posts_editorial_status" DEFAULT 'draft',
  	"version_published_at" timestamp(3) with time zone,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );

  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_users_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_idx" ON "_posts_v" USING btree ("version_cover_id");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_autosave_idx" ON "_posts_v" USING btree ("autosave");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE "_posts_v" CASCADE;
  DROP INDEX "posts__status_idx";
  ALTER TABLE "posts" DROP COLUMN "_status";

  -- Restaura "enum_posts_status" com 3 valores para o "status" custom.
  DROP TYPE "public"."enum_posts_status";
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'review', 'published');
  ALTER TABLE "posts" ALTER COLUMN "status" DROP DEFAULT;
  ALTER TABLE "posts" ALTER COLUMN "status" SET DATA TYPE "public"."enum_posts_status" USING "status"::text::"public"."enum_posts_status";
  ALTER TABLE "posts" ALTER COLUMN "status" SET DEFAULT 'draft';
  ALTER TABLE "posts" ALTER COLUMN "status" SET NOT NULL;

  ALTER TABLE "posts" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;

  DROP TYPE "public"."enum_posts_editorial_status";
  DROP TYPE "public"."enum__posts_v_version_status";`)
}
