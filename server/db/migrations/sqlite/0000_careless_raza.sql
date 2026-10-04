CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT 'neutral' NOT NULL,
	`icon` text DEFAULT 'i-lucide-tag' NOT NULL,
	`position` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `categories_user_idx` ON `categories` (`user_id`);--> statement-breakpoint
CREATE TABLE `completions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reminder_id` integer NOT NULL,
	`done_on` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`reminder_id`) REFERENCES `reminders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `completions_reminder_idx` ON `completions` (`reminder_id`);--> statement-breakpoint
CREATE TABLE `magic_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `magic_tokens_token_hash_unique` ON `magic_tokens` (`token_hash`);--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`category_id` integer,
	`name` text NOT NULL,
	`note` text,
	`kind` text DEFAULT 'recurring' NOT NULL,
	`min_interval` integer,
	`max_interval` integer,
	`unit` text DEFAULT 'month' NOT NULL,
	`last_done_on` text,
	`due_on` text,
	`notify_days_before` integer DEFAULT 1 NOT NULL,
	`notify_on_window_open` integer DEFAULT false NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`notified_deadline` text,
	`notified_window_start` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `reminders_user_idx` ON `reminders` (`user_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);