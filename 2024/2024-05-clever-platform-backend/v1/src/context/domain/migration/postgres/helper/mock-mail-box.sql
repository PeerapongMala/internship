INSERT INTO "arcade"."arcade_game" (id, name, image_url, url, arcade_coin_cost) 
VALUES 
(1, 'Fruit Ninja', 'https://example.com/images/fruit-ninja.jpg', 'https://example.com/games/fruit-ninja', 50),
(2, 'Survival IO', 'https://example.com/images/survival-io.jpg', 'https://example.com/games/survival-io', 75),
(3, 'Last War', 'https://example.com/images/last-war.jpg', 'https://example.com/games/last-war', 100);

INSERT INTO "announcement"."announcement"
(id, school_id, scope, type, started_at, ended_at, title, description, status, created_at, created_by)
VALUES 
(1, 1, 'Subject', 'event', '2025-02-28 00:00:00', '2025-03-15 23:59:59', 'ประกาศกิจกรรม', 'Test description 1', 'enabled', '2025-02-08', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(2, 1, 'Subject', 'reward', '2025-02-28 00:00:00', '2025-03-15 23:59:59', 'แจกไอเทม 1', 'Test description 2', 'enabled', '2025-02-07', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(3, 1, 'Subject', 'reward', '2025-02-28 00:00:00', '2025-03-15 23:59:59', 'แจกไอเทม 2', 'Test description 3', 'enabled', '2025-02-07', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(4, 1, 'Subject', 'notification', '2025-02-28 00:00:00', '2025-03-15 23:59:59', 'ประกาศจากระบบ 1', 'Test description 4', 'enabled', '2025-02-07', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10'),
(5, 1, 'Subject', 'notification', '2025-02-28 00:00:00', '2025-03-15 23:59:59', 'ประกาศจากระบบ 2', 'Test description 5', 'enabled', '2025-02-07', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');

INSERT INTO "announcement"."announcement_event"
(announcement_id,subject_id,academic_year,arcade_game_id)
VALUES
(1,1,2568,1);

INSERT INTO "announcement"."announcement_reward"
(announcement_id,subject_id,academic_year)
VALUES
(2,1,2568),
(3,1,2568);

INSERT INTO "announcement"."announcement_reward_item"
(item_id,announcemnet_reward_id,amount,expired_at)
VALUES
(1,2,10,'2025-03-15 23:59:59');


INSERT INTO "announcement"."announcement_reward_coin"
(announcement_reward_id,gold_coin_amount,arcade_coin_amount,ice_amount)
VALUES
(3,1000,1000,1000);

INSERT INTO "announcement"."announcement_system"
(announcement_id,subject_id,academic_year)
VALUES
(4,1,2568),
(5,1,2568);


INSERT INTO "teacher_item"."teacher_reward_transaction"
(subject_id, teacher_id,student_id,class_id,item_id,amount,status,created_at,created_by,is_deleted)
VALUES
(1, 1,'cd1592be-7302-4805-a172-86956b0bf2a1',1,1,10,'send','2025-02-28','21ceee5d-ee10-462b-a1e3-659a2187ca95',false),
(1,1, 'cd1592be-7302-4805-a172-86956b0bf2a1',1,1,10,'send','2025-02-28','21ceee5d-ee10-462b-a1e3-659a2187ca95',false);
