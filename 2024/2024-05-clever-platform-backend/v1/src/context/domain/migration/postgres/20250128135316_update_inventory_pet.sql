-- +goose Up
-- +goose StatementBegin
ALTER TABLE "inventory"."inventory_pet"
DROP COLUMN "path";
ALTER TABLE "inventory"."inventory_pet"
ADD COLUMN "pet_id" INT REFERENCES "game"."pet" ("id");
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "inventory"."inventory_pet"
DROP COLUMN "pet_id";
ALTER TABLE "inventory"."inventory_pet"
ADD COLUMN "path" VARCHAR NOT NULL;
-- +goose StatementEnd
