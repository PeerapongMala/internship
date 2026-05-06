INSERT INTO bug.bug_report (id, platform, "type", "version", priority, description, status, created_at, created_by,
                            admin_login_as, browser, os, url)
VALUES (1,'App', 'Bug', '1.0', '!!!', 'lazy dogThe quick brown', 'pending', '1984-10-31 08:26:47.356',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL, NULL, NULL, NULL),
       (2, 'App', 'Bug', '1.0', '!!!', 'quick brown fox jumps over the lazy dogT', 'closed', '1985-04-23 10:37:32.613',
        '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL, NULL, NULL, NULL);

INSERT INTO bug.bug_report_image (bug_report_id, image_url)
VALUES (1, 'https://fastly.picsum.photos/id/894/200/200.jpg?hmac=h3PvihhxRrUznPuW-OPbq7zxa0On5jLsyYbWwI6nW6w'),
       (1, 'https://fastly.picsum.photos/id/894/200/200.jpg?hmac=h3PvihhxRrUznPuW-OPbq7zxa0On5jLsyYbWwI6nW6w');

INSERT INTO bug.bug_report_status_log (bug_report_id, status, message, created_at, created_by)
VALUES (2, 'pending', 'brown f', '1980-07-04 06:12:33.18', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (2, 'in-progress', 'fox jumps over the', '2002-04-29 05:29:40.746', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
       (2, 'closed', 'the lazy dogThe quick', '2004-09-19 04:46:28.419', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
