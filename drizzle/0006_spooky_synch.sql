CREATE TABLE "commerce"."clover_devices" (
	"id" serial PRIMARY KEY NOT NULL,
	"merchant_id" integer NOT NULL,
	"serial" varchar(40) NOT NULL,
	"nickname" text,
	"is_firing_device" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"last_seen_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clover_devices_serial_unique" UNIQUE("serial")
);
--> statement-breakpoint
CREATE TABLE "commerce"."clover_merchants" (
	"id" serial PRIMARY KEY NOT NULL,
	"clover_merchant_id" varchar(60) NOT NULL,
	"merchant_name" text,
	"access_token" varchar(255) NOT NULL,
	"refresh_token" varchar(255) NOT NULL,
	"token_expires_at" timestamp with time zone NOT NULL,
	"api_base_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clover_merchants_clover_merchant_id_unique" UNIQUE("clover_merchant_id")
);
--> statement-breakpoint
CREATE TABLE "commerce"."clover_printers" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" integer NOT NULL,
	"clover_printer_id" varchar(40) NOT NULL,
	"name" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clover_printers_device_printer_unique" UNIQUE("device_id","clover_printer_id")
);
--> statement-breakpoint
CREATE TABLE "commerce"."print_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"device_id" integer,
	"printer_id" integer,
	"provider" varchar(20) DEFAULT 'clover' NOT NULL,
	"status" varchar(30) DEFAULT 'queued' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_error" text,
	"last_job_id" varchar(60),
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"printed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "print_jobs_order_unique" UNIQUE("order_id")
);
--> statement-breakpoint
ALTER TABLE "commerce"."clover_devices" ADD CONSTRAINT "clover_devices_merchant_id_clover_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "commerce"."clover_merchants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."clover_printers" ADD CONSTRAINT "clover_printers_device_id_clover_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "commerce"."clover_devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."print_jobs" ADD CONSTRAINT "print_jobs_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "commerce"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."print_jobs" ADD CONSTRAINT "print_jobs_device_id_clover_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "commerce"."clover_devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commerce"."print_jobs" ADD CONSTRAINT "print_jobs_printer_id_clover_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "commerce"."clover_printers"("id") ON DELETE no action ON UPDATE no action;