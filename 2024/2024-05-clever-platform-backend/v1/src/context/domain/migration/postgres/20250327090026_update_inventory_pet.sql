-- +goose Up
-- +goose StatementBegin
ALTER TABLE inventory.inventory_pet
    ADD CONSTRAINT inventory_pet_uq UNIQUE (inventory_id, pet_id);

ALTER TABLE inventory.inventory_pet
DROP CONSTRAINT inventory_pet_pkey;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE inventory.inventory_pet
DROP CONSTRAINT IF EXISTS inventory_pet_uq;

ALTER TABLE inventory.inventory_pet
ADD CONSTRAINT inventory_pet_pkey PRIMARY KEY (inventory_id, pet_id);
-- +goose StatementEnd