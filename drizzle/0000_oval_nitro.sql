CREATE SCHEMA "commerce";
--> statement-breakpoint
CREATE TABLE "commerce"."orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
