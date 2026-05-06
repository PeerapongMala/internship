package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d04-custom-avatar-custom-avatar-v1/constant"
)

func (postgresRepository *postgresRepository) GetCustomAvatarCharacterById(c constant.GetInventoryAvatarRequest) (r []constant.InventoryAvatarEntity, err error) {

	query := `SELECT
    	inv.id AS "inventory_id",
		in_av.avatar_id,
		coalesce(in_av.is_equipped, false) AS "is_equipped",
		g_av.model_id,
		g_av.level
	FROM
		inventory.inventory inv
	LEFT JOIN 
		inventory.inventory_avatar in_av on inv.id = in_av.inventory_id
	LEFT JOIN 
		game.avatar g_av ON in_av.avatar_id = g_av.id
	WHERE
	    "avatar_id" IS NOT NULL
		AND inv.student_id = $1`

	err = postgresRepository.Database.Select(&r, query, c.StudentId)
	if err != nil {
		return r, err
	}

	return r, nil
}
