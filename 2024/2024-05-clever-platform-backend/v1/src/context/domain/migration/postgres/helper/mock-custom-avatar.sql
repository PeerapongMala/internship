INSERT INTO inventory.inventory
(student_id, gold_coin, arcade_coin, ice)
VALUES('cd1592be-7302-4805-a172-86956b0bf2a1', 200, 200, 1);

INSERT INTO item.item
( teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( 1, NULL, 'badge', 'item badge 3', 'item badge 3 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-01-31 03:55:02.382', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-01-31 03:55:02.382', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);
INSERT INTO item.item
( teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( 1, NULL, 'badge', 'item badge 2', 'item badge 2 description', 'https://w7.pngwing.com/pngs/15/560/png-transparent-verified-badge-symbol-computer-icons-twitter-discord-flat-icon-blue-text-logo-thumbnail.png', 'enabled', '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( 1, NULL, 'coupon', 'item badge 33', 'item badge 3 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2024-12-16 06:50:07.699', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-01-31 03:56:23.091', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10');
INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( 1, NULL, 'frame', 'item frame 3', 'item frame 3 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-02-01 07:31:48.017', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-02-01 07:31:48.017', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);
INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( NULL, NULL, 'frame', 'item badge 4', 'item badge 4 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

INSERT INTO item.badge
( item_id, template_path, badge_description)
VALUES(1, '/path/to/badge-template', 'นักเรียนเรียนรู้เร็ว');
INSERT INTO item.badge
( item_id, template_path, badge_description)
VALUES(2, '/path/to/badge-template2', 'นักเรียนเรียนรู้ช้า');
INSERT INTO item.badge
( item_id, template_path, badge_description)
VALUES(6, '/path/to/badge-template', 'นักเรียนเรียนรู้เร็วช้า');

INSERT INTO game.avatar
(id, model_id, "level")
VALUES(1, '1', 1);
INSERT INTO game.avatar
(id, model_id, "level")
VALUES(2, '2', 1);
INSERT INTO game.avatar
(id, model_id, "level")
VALUES(3, '3', 3);

INSERT INTO game.pet
(id, model_id)
VALUES(1, '1');
INSERT INTO game.pet
(id, model_id)
VALUES(2, '2');


INSERT INTO inventory.inventory_avatar
(inventory_id, avatar_id, is_equipped)
VALUES(1, 1, false);

INSERT INTO inventory.inventory_avatar
(inventory_id, avatar_id, is_equipped)
VALUES(1, 2, true);

INSERT INTO inventory.inventory_avatar
(inventory_id, avatar_id, is_equipped)
VALUES(1, 3, false);


INSERT INTO inventory.inventory_item
(inventory_id, item_id, amount, is_equipped)
VALUES(1, 2, 10, true);

INSERT INTO inventory.inventory_item
(inventory_id, item_id, amount, is_equipped)
VALUES(1, 7, 30, true);

INSERT INTO inventory.inventory_item
(inventory_id, item_id, amount, is_equipped)
VALUES(1, 1, 20, true);


INSERT INTO inventory.inventory_pet
(inventory_id, is_equipped, pet_id)
VALUES(1, true, 1);

/* more mock data 26-02-2025 */
/* add item badge and coupon */
INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( NULL, NULL, 'badge', 'item badge 7', 'item badge 7 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( NULL, NULL, 'badge', 'item badge 8', 'item badge 8 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( NULL, NULL, 'badge', 'item badge 9', 'item badge 9 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( NULL, NULL, 'coupon', 'item coupon 7', 'item coupon 7 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( NULL, NULL, 'coupon', 'item coupon 8', 'item coupon 8 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

INSERT INTO item.item
(teacher_item_group_id, template_item_id, "type", "name", description, image_url, status, created_at, created_by, updated_at, updated_by, admin_login_as)
VALUES( NULL, NULL, 'coupon', 'item coupon 9', 'item coupon 9 description', 'https://e7.pngegg.com/pngimages/626/893/png-clipart-blue-and-white-check-logo-facebook-social-media-verified-badge-logo-vanity-url-blue-checkmark-blue-angle-thumbnail.png', 'enabled', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', '2025-02-11 02:39:31.833', '1e5f3af4-f2ea-4a30-bf8a-6def2e8eaf10', NULL);

/* item_id get from lasted item.id type badge*/
INSERT INTO item.badge
( item_id, template_path, badge_description)
VALUES(16, '/path/to/badge-template-7', 'โล่ระดับ 7');

INSERT INTO item.badge
( item_id, template_path, badge_description)
VALUES(17, '/path/to/badge-template-8', 'โล่ระดับ 8');

INSERT INTO item.badge
( item_id, template_path, badge_description)
VALUES(18, '/path/to/badge-template-9', 'โล่ระดับ 9');