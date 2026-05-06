package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"

func (postgresRepository *postgresRepository) UpdateCustomAvatarPetEquipped(c constant.UpdateCustomAvatarPetEquippedRequest) (r constant.InventoryAvatarPetEntity, err error) {

	// reset another inventory_avatar is_equipped = false
	queryUpdate := `UPDATE inventory.inventory_pet
					SET is_equipped = false
					WHERE 
					inventory_id = (SELECT id FROM inventory.inventory WHERE student_id = $1)
					AND pet_id <> $2
					RETURNING is_equipped, pet_id, inventory_id`

	_, err = postgresRepository.Database.Exec(queryUpdate, c.StudentId, c.PetId)
	if err != nil {
		return r, err
	}

	queryUpdate = `UPDATE 
					inventory.inventory_pet 
				SET 
					is_equipped = $1
				WHERE 
					inventory_id = (SELECT id FROM inventory.inventory WHERE student_id = $2) 
					AND pet_id = $3
				RETURNING 
					 inventory_id, is_equipped, pet_id`
	err = postgresRepository.Database.QueryRow(queryUpdate, c.IsEquipped, c.StudentId, c.PetId).Scan(&r.InventoryId, &r.IsEquipped, &r.PetId)
	if err != nil {
		return r, err
	}

	return r, nil
}
