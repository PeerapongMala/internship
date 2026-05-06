-- +goose Up
INSERT INTO "arcade"."arcade_game" (id, name, image_url, url, arcade_coin_cost) 
VALUES 
(1, 'Fruit Ninja', 'https://example.com/images/fruit-ninja.jpg', 'https://example.com/games/fruit-ninja', 50),
(2, 'Survival IO', 'https://example.com/images/survival-io.jpg', 'https://example.com/games/survival-io', 75),
(3, 'Last War', 'https://example.com/images/last-war.jpg', 'https://example.com/games/last-war', 100);

-- +goose Down
DELETE FROM "arcade"."arcade_game" 
WHERE id IN (1, 2, 3);