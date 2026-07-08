CREATE TABLE "commerce"."customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" varchar(30) NOT NULL,
	"email" varchar(120) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "commerce"."order_line_item_modifiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_line_id" integer NOT NULL,
	"option_id" integer NOT NULL,
	"label" text NOT NULL,
	"price_delta_cents" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commerce"."order_line_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"line_item_id" integer NOT NULL,
	"name" text NOT NULL,
	"base_price_cents" integer NOT NULL,
	"category_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"unit_cents" integer NOT NULL,
	"line_total_cents" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commerce"."payment_intents" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"provider" varchar(20) DEFAULT 'stripe' NOT NULL,
	"provider_payment_intent_id" varchar(255),
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" varchar(3) DEFAULT 'gtq' NOT NULL,
	"checkout_session_url" text,
	"checkout_session_id" varchar(255),
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_intents_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "commerce"."webhook_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"provider" varchar(20) NOT NULL,
	"provider_event_id" varchar(255),
	"event_type" varchar(120) NOT NULL,
	"payload" jsonb NOT NULL,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "webhook_events_provider_event_id_unique" UNIQUE("provider_event_id")
);
--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "order_number" varchar(20);--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "status" varchar(30) DEFAULT 'pending_payment' NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "customer_id" integer;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "phone" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "email" varchar(120) NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "pickup_mode" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "pickup_slot" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "subtotal_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "discount_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "tax_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "tip_cents" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "total_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "promotion_id" integer;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD COLUMN "promotion_code" varchar(50);--> statement-breakpoint
ALTER TABLE "commerce"."order_line_item_modifiers" ADD CONSTRAINT "order_line_item_modifiers_order_line_id_order_line_items_id_fk" FOREIGN KEY ("order_line_id") REFERENCES "commerce"."order_line_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."order_line_items" ADD CONSTRAINT "order_line_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "commerce"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."payment_intents" ADD CONSTRAINT "payment_intents_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "commerce"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "commerce"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."orders" ADD CONSTRAINT "orders_order_number_unique" UNIQUE("order_number");