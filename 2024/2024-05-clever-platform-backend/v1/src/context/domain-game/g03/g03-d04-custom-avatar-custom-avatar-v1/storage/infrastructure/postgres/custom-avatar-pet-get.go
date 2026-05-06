package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"

func (postgresRepository *postgresRepository) GetCustomAvatarPetById(c constant.GetInventoryAvatarRequest) (r []constant.InventoryAvatarPetEntity, err error) {
	query := `	SELECT inv.id AS "inventory_id", inv_pet.pet_id, coalesce(inv_pet.is_equipped, false) AS "is_equipped", g_pet.model_id 
				FROM 
					inventory.inventory inv
				LEFT JOIN 
					inventory.inventory_pet  inv_pet on inv.id = inv_pet.inventory_id
				LEFT JOIN game.pet g_pet ON inv_pet.pet_id = g_pet.id
				WHERE 
				    "pet_id" IS NOT NULL
					AND inv.student_id = $1`
	err = postgresRepository.Database.Select(&r, query, c.StudentId)
	if err != nil {
		return r, err
	}

	return r, nil
}
