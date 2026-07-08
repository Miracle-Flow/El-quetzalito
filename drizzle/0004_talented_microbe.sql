ALTER TABLE "commerce"."payment_intents" ADD COLUMN "amount_received_cents" integer;--> statement-breakpoint
ALTER TABLE "commerce"."webhook_events" ADD COLUMN "status" varchar(30) DEFAULT 'received' NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."webhook_events" ADD COLUMN "error_message" text;