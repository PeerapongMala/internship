package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d03-redeem-v1/constant"

	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) UpdateInventory(tx *sqlx.Tx, input *constant.InventoryDTO) error {

	queryInventory := `
	UPDATE "inventory"."inventory"
	SET arcade_coin = arcade_coin + $1,
		gold_coin = gold_coin + $2,
		ice = ice + $3
	WHERE student_id = $4
	RETURNING id;
	`

	queryInventoryAvatar := `
	INSERT INTO inventory.inventory_avatar (
		inventory_id,
		avatar_id,
		is_equipped
	)
	VALUES ($1, $2, false)
	RETURNING inventory_id;
	`

	queryInventoryPet := `
	INSERT INTO inventory.inventory_pet (
		inventory_id,
		pet_id,
		is_equipped
	)
	VALUES ($1, $2, false)
	RETURNING inventory_id;
	`

	var inventoryId, inventoryAvatarInsertedId, inventoryPetInsertedId int
	err := tx.QueryRowx(
		queryInventory,
		input.ArcadeCoin,
		input.GoldCoin,
		input.IceAmount,
		input.StudentId,
	).Scan(&inventoryId)

	if err != nil {
		return err
	}

	if input.AvatarId != nil && !CheckAvartarIdIsExist(tx, input.StudentId, *input.AvatarId) {
		err = tx.QueryRowx(
			queryInventoryAvatar,
			inventoryId,
			*input.AvatarId,
		).Scan(&inventoryAvatarInsertedId)

		if err != nil {
			return err
		}
	}

	if input.PetId != nil && !CheckPetIdIsExist(tx, input.StudentId, *input.PetId) {
		err = tx.QueryRowx(
			queryInventoryPet,
			inventoryId,
			*input.PetId,
		).Scan(&inventoryPetInsertedId)

		if err != nil {
			return err
		}
	}

	return nil
}

func CheckAvartarIdIsExist(tx *sqlx.Tx, studentId string, avatarId int) bool {

	query := `
		SELECT count(*)
		FROM inventory.inventory i
		LEFT JOIN inventory.inventory_avatar ia
		ON i.id = ia.inventory_id
		WHERE i.student_id = $1
		AND ia.avatar_id = $2
	`

	var count int
	err := tx.QueryRowx(query, studentId, avatarId).Scan(&count)
	if err != nil {
		return false
	}

	if count > 0 {
		return true
	}

	return false
}

func CheckPetIdIsExist(tx *sqlx.Tx, studentId string, petId int) bool {

	query := `
		SELECT count(*)
		FROM inventory.inventory i
		LEFT JOIN inventory.inventory_pet ip
		ON i.id = ip.inventory_id
		WHERE i.student_id = $1
		AND ip.pet_id = $2
	`

	var count int
	err := tx.QueryRowx(query, studentId, petId).Scan(&count)
	if err != nil {
		return false
	}

	if count > 0 {
		return true
	}

	return false
}
