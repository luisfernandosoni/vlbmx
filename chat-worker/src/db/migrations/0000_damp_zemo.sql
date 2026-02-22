CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`content` text NOT NULL,
	`timestamp` text NOT NULL
);
