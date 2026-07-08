import { sql } from "@payloadcms/db-postgres";
import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/drizzle/postgres";

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE SCHEMA IF NOT EXISTS "payload";`);
  await db.execute(sql`
   CREATE TYPE "payload"."enum_users_role" AS ENUM('admin', 'owner');
  CREATE TYPE "payload"."enum_menu_item_availability_type" AS ENUM('steamTable', 'madeToOrder');
  CREATE TYPE "payload"."enum_modifier_group_selection_type" AS ENUM('pickOne', 'pickMany');
  CREATE TYPE "payload"."enum_modifier_group_pricing_mode" AS ENUM('included', 'priced');
  CREATE TYPE "payload"."enum_daily_availability_status" AS ENUM('available', 'soldOut');
  CREATE TYPE "payload"."enum_promotion_application_type" AS ENUM('auto', 'code');
  CREATE TYPE "payload"."enum_promotion_discount_type" AS ENUM('percent', 'fixed');
  CREATE TYPE "payload"."enum_promotion_scope" AS ENUM('order', 'category');
  CREATE TYPE "payload"."enum_store_settings_weekly_hours_day" AS ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "payload"."enum_users_role" DEFAULT 'owner' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."migration_check" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload"."menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."category" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"menu_id" integer,
  	"sort_order" numeric DEFAULT 0 NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."menu_item" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"base_price" numeric NOT NULL,
  	"category_id" integer NOT NULL,
  	"availability_type" "payload"."enum_menu_item_availability_type" NOT NULL,
  	"active" boolean DEFAULT true,
  	"image_id" integer,
  	"sort_order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."menu_item_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"modifier_group_id" integer
  );
  
  CREATE TABLE "payload"."modifier_group" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"selection_type" "payload"."enum_modifier_group_selection_type" NOT NULL,
  	"required" boolean DEFAULT false,
  	"min_selection" numeric DEFAULT 0,
  	"max_selection" numeric DEFAULT 1,
  	"pricing_mode" "payload"."enum_modifier_group_pricing_mode" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."modifier_group_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"modifier_option_id" integer
  );
  
  CREATE TABLE "payload"."modifier_option" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"price_delta" numeric DEFAULT 0 NOT NULL,
  	"group_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."daily_availability" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"menu_item_id" integer NOT NULL,
  	"status" "payload"."enum_daily_availability_status" DEFAULT 'available' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."promotion" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"application_type" "payload"."enum_promotion_application_type" NOT NULL,
  	"code" varchar,
  	"discount_type" "payload"."enum_promotion_discount_type" NOT NULL,
  	"value" numeric NOT NULL,
  	"scope" "payload"."enum_promotion_scope" NOT NULL,
  	"category_id" integer,
  	"valid_from" timestamp(3) with time zone,
  	"valid_until" timestamp(3) with time zone,
  	"min_order_value" numeric,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"migration_check_id" integer,
  	"media_id" integer,
  	"menu_id" integer,
  	"category_id" integer,
  	"menu_item_id" integer,
  	"modifier_group_id" integer,
  	"modifier_option_id" integer,
  	"daily_availability_id" integer,
  	"promotion_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."store_settings_weekly_hours" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "payload"."enum_store_settings_weekly_hours_day" NOT NULL,
  	"open" varchar DEFAULT '10:00',
  	"close" varchar DEFAULT '20:00',
  	"closed" boolean DEFAULT false
  );
  
  CREATE TABLE "payload"."store_settings_daily_overrides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"closed" boolean DEFAULT false,
  	"open" varchar,
  	"close" varchar
  );
  
  CREATE TABLE "payload"."store_settings_tip_presets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric NOT NULL
  );
  
  CREATE TABLE "payload"."store_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"store_name" varchar DEFAULT 'El Quetzalito' NOT NULL,
  	"is_open" boolean DEFAULT true,
  	"timezone" varchar DEFAULT 'America/New_York' NOT NULL,
  	"tax_rate" numeric DEFAULT 0.08875,
  	"lead_time_minutes" numeric DEFAULT 20,
  	"slot_interval_minutes" numeric DEFAULT 15,
  	"address" varchar,
  	"phone" varchar,
  	"pickup_instructions" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."category" ADD CONSTRAINT "category_menu_id_menu_id_fk" FOREIGN KEY ("menu_id") REFERENCES "payload"."menu"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."menu_item" ADD CONSTRAINT "menu_item_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."category"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."menu_item" ADD CONSTRAINT "menu_item_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."menu_item_rels" ADD CONSTRAINT "menu_item_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."menu_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."menu_item_rels" ADD CONSTRAINT "menu_item_rels_modifier_group_fk" FOREIGN KEY ("modifier_group_id") REFERENCES "payload"."modifier_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."modifier_group_rels" ADD CONSTRAINT "modifier_group_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."modifier_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."modifier_group_rels" ADD CONSTRAINT "modifier_group_rels_modifier_option_fk" FOREIGN KEY ("modifier_option_id") REFERENCES "payload"."modifier_option"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."modifier_option" ADD CONSTRAINT "modifier_option_group_id_modifier_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "payload"."modifier_group"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."daily_availability" ADD CONSTRAINT "daily_availability_menu_item_id_menu_item_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "payload"."menu_item"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."promotion" ADD CONSTRAINT "promotion_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."category"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_migration_check_fk" FOREIGN KEY ("migration_check_id") REFERENCES "payload"."migration_check"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_fk" FOREIGN KEY ("menu_id") REFERENCES "payload"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_category_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_item_fk" FOREIGN KEY ("menu_item_id") REFERENCES "payload"."menu_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_modifier_group_fk" FOREIGN KEY ("modifier_group_id") REFERENCES "payload"."modifier_group"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_modifier_option_fk" FOREIGN KEY ("modifier_option_id") REFERENCES "payload"."modifier_option"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_daily_availability_fk" FOREIGN KEY ("daily_availability_id") REFERENCES "payload"."daily_availability"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_promotion_fk" FOREIGN KEY ("promotion_id") REFERENCES "payload"."promotion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."store_settings_weekly_hours" ADD CONSTRAINT "store_settings_weekly_hours_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."store_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."store_settings_daily_overrides" ADD CONSTRAINT "store_settings_daily_overrides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."store_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."store_settings_tip_presets" ADD CONSTRAINT "store_settings_tip_presets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."store_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "migration_check_updated_at_idx" ON "payload"."migration_check" USING btree ("updated_at");
  CREATE INDEX "migration_check_created_at_idx" ON "payload"."migration_check" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE UNIQUE INDEX "menu_slug_idx" ON "payload"."menu" USING btree ("slug");
  CREATE INDEX "menu_updated_at_idx" ON "payload"."menu" USING btree ("updated_at");
  CREATE INDEX "menu_created_at_idx" ON "payload"."menu" USING btree ("created_at");
  CREATE UNIQUE INDEX "category_slug_idx" ON "payload"."category" USING btree ("slug");
  CREATE INDEX "category_menu_idx" ON "payload"."category" USING btree ("menu_id");
  CREATE INDEX "category_updated_at_idx" ON "payload"."category" USING btree ("updated_at");
  CREATE INDEX "category_created_at_idx" ON "payload"."category" USING btree ("created_at");
  CREATE UNIQUE INDEX "menu_item_slug_idx" ON "payload"."menu_item" USING btree ("slug");
  CREATE INDEX "menu_item_category_idx" ON "payload"."menu_item" USING btree ("category_id");
  CREATE INDEX "menu_item_image_idx" ON "payload"."menu_item" USING btree ("image_id");
  CREATE INDEX "menu_item_updated_at_idx" ON "payload"."menu_item" USING btree ("updated_at");
  CREATE INDEX "menu_item_created_at_idx" ON "payload"."menu_item" USING btree ("created_at");
  CREATE INDEX "menu_item_rels_order_idx" ON "payload"."menu_item_rels" USING btree ("order");
  CREATE INDEX "menu_item_rels_parent_idx" ON "payload"."menu_item_rels" USING btree ("parent_id");
  CREATE INDEX "menu_item_rels_path_idx" ON "payload"."menu_item_rels" USING btree ("path");
  CREATE INDEX "menu_item_rels_modifier_group_id_idx" ON "payload"."menu_item_rels" USING btree ("modifier_group_id");
  CREATE INDEX "modifier_group_updated_at_idx" ON "payload"."modifier_group" USING btree ("updated_at");
  CREATE INDEX "modifier_group_created_at_idx" ON "payload"."modifier_group" USING btree ("created_at");
  CREATE INDEX "modifier_group_rels_order_idx" ON "payload"."modifier_group_rels" USING btree ("order");
  CREATE INDEX "modifier_group_rels_parent_idx" ON "payload"."modifier_group_rels" USING btree ("parent_id");
  CREATE INDEX "modifier_group_rels_path_idx" ON "payload"."modifier_group_rels" USING btree ("path");
  CREATE INDEX "modifier_group_rels_modifier_option_id_idx" ON "payload"."modifier_group_rels" USING btree ("modifier_option_id");
  CREATE INDEX "modifier_option_group_idx" ON "payload"."modifier_option" USING btree ("group_id");
  CREATE INDEX "modifier_option_updated_at_idx" ON "payload"."modifier_option" USING btree ("updated_at");
  CREATE INDEX "modifier_option_created_at_idx" ON "payload"."modifier_option" USING btree ("created_at");
  CREATE INDEX "daily_availability_menu_item_idx" ON "payload"."daily_availability" USING btree ("menu_item_id");
  CREATE INDEX "daily_availability_updated_at_idx" ON "payload"."daily_availability" USING btree ("updated_at");
  CREATE INDEX "daily_availability_created_at_idx" ON "payload"."daily_availability" USING btree ("created_at");
  CREATE UNIQUE INDEX "date_menuItem_idx" ON "payload"."daily_availability" USING btree ("date","menu_item_id");
  CREATE UNIQUE INDEX "promotion_code_idx" ON "payload"."promotion" USING btree ("code");
  CREATE INDEX "promotion_category_idx" ON "payload"."promotion" USING btree ("category_id");
  CREATE INDEX "promotion_updated_at_idx" ON "payload"."promotion" USING btree ("updated_at");
  CREATE INDEX "promotion_created_at_idx" ON "payload"."promotion" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_migration_check_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("migration_check_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_menu_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("menu_id");
  CREATE INDEX "payload_locked_documents_rels_category_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("category_id");
  CREATE INDEX "payload_locked_documents_rels_menu_item_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("menu_item_id");
  CREATE INDEX "payload_locked_documents_rels_modifier_group_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("modifier_group_id");
  CREATE INDEX "payload_locked_documents_rels_modifier_option_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("modifier_option_id");
  CREATE INDEX "payload_locked_documents_rels_daily_availability_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("daily_availability_id");
  CREATE INDEX "payload_locked_documents_rels_promotion_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("promotion_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "store_settings_weekly_hours_order_idx" ON "payload"."store_settings_weekly_hours" USING btree ("_order");
  CREATE INDEX "store_settings_weekly_hours_parent_id_idx" ON "payload"."store_settings_weekly_hours" USING btree ("_parent_id");
  CREATE INDEX "store_settings_daily_overrides_order_idx" ON "payload"."store_settings_daily_overrides" USING btree ("_order");
  CREATE INDEX "store_settings_daily_overrides_parent_id_idx" ON "payload"."store_settings_daily_overrides" USING btree ("_parent_id");
  CREATE INDEX "store_settings_tip_presets_order_idx" ON "payload"."store_settings_tip_presets" USING btree ("_order");
  CREATE INDEX "store_settings_tip_presets_parent_id_idx" ON "payload"."store_settings_tip_presets" USING btree ("_parent_id");`);
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."migration_check" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."menu" CASCADE;
  DROP TABLE "payload"."category" CASCADE;
  DROP TABLE "payload"."menu_item" CASCADE;
  DROP TABLE "payload"."menu_item_rels" CASCADE;
  DROP TABLE "payload"."modifier_group" CASCADE;
  DROP TABLE "payload"."modifier_group_rels" CASCADE;
  DROP TABLE "payload"."modifier_option" CASCADE;
  DROP TABLE "payload"."daily_availability" CASCADE;
  DROP TABLE "payload"."promotion" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."store_settings_weekly_hours" CASCADE;
  DROP TABLE "payload"."store_settings_daily_overrides" CASCADE;
  DROP TABLE "payload"."store_settings_tip_presets" CASCADE;
  DROP TABLE "payload"."store_settings" CASCADE;
  DROP TYPE "payload"."enum_users_role";
  DROP TYPE "payload"."enum_menu_item_availability_type";
  DROP TYPE "payload"."enum_modifier_group_selection_type";
  DROP TYPE "payload"."enum_modifier_group_pricing_mode";
  DROP TYPE "payload"."enum_daily_availability_status";
  DROP TYPE "payload"."enum_promotion_application_type";
  DROP TYPE "payload"."enum_promotion_discount_type";
  DROP TYPE "payload"."enum_promotion_scope";
  DROP TYPE "payload"."enum_store_settings_weekly_hours_day";`);
}
