CREATE TABLE
`users` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(50) NOT NULL,
    `email` varchar(50) NOT NULL,
    `username` varchar(20) NOT NULL,
    `password` varchar(32) NOT NULL,
    `forget_pwd` varchar(255) DEFAULT NULL,
    `slogan` varchar(500) DEFAULT 'Vịt con mới sinh còn ngơ ngác',
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`),
    UNIQUE KEY `username` (`username`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE
`sdtags` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `icon` varchar(50) NOT NULL,
    `text_color` varchar(10) NOT NULL,
    `bg_color` varchar(10) NOT NULL,
    `time_today` int(11) unsigned NOT NULL DEFAULT 0,
    `time_week` int(11) unsigned NOT NULL DEFAULT 0,
    `time_month` int(11) unsigned NOT NULL DEFAULT 0,
    `time_year` int(11) unsigned NOT NULL DEFAULT 0,
    `time_total` int(11) unsigned NOT NULL DEFAULT 0,
    `user` int(11) unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `user` (`user`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE
  `diaries` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `sdtag` int(11) unsigned NOT NULL,
    `user` int(11) unsigned NOT NULL,
    `is_learning` int(1) unsigned NOT NULL DEFAULT 1,
    `start_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `stop_at` timestamp NULL DEFAULT NULL,
    `log` text DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `select_learning` (`user`, `is_learning` DESC),
    KEY `sdtag` (`sdtag`, `user`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE
  `studytimes` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `user` int(11) unsigned DEFAULT NULL,
    `sdtag` int(11) unsigned DEFAULT NULL,
    `type` int(1) unsigned DEFAULT 0,
    `time` int(11) unsigned DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `user` (`user`),
    KEY `sdtag` (`sdtag`),
    KEY `type` (`type`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;