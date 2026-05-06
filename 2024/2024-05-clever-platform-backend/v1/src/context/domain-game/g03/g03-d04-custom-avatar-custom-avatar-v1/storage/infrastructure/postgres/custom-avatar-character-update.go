package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateCustomAvatarCharacterEquipped(c constant.UpdateInventoryAvatarEquippedRequest) (r constant.InventoryAvatarEntity, err error) {

	// reset another inventory_avatar is_equipped = false
	queryUpdate := `UPDATE inventory.inventory_avatar 
					SET is_equipped = false  
					WHERE avatar_id <> $1 
					AND inventory_id = (SELECT id FROM inventory.inventory WHERE student_id = $2)
					RETURNING is_equipped, avatar_id, inventory_id `

	_, err = postgresRepository.Database.Exec(queryUpdate, c.AvatarId, c.StudentId)
	if err != nil {
		return r, err
	}

	// set is_equipped = true
	queryUpdate = `UPDATE inventory.inventory_avatar 
					SET is_equipped = $1  
					WHERE avatar_id = $2 
					AND inventory_id = (SELECT id FROM inventory.inventory WHERE student_id = $3)
					RETURNING is_equipped, avatar_id, inventory_id `

	err = postgresRepository.Database.QueryRow(queryUpdate, c.IsEquipped, c.AvatarId, c.StudentId).Scan(&r.IsEquipped, &r.AvatarId, &r.InventoryId)
	if err != nil {
		return r, err
	}

	return r, nil
}
