package postgres

import (
	"database/sql"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetInventoryProfile(userID string) (*constant.InventoryProfile, error) {
	query := `
		WITH filtered_inventory AS (
			SELECT
				ii.id
			FROM inventory.inventory ii
			WHERE student_id = $1
		),
		cte_avatar AS (
			SELECT
				ia.inventory_id AS id,
				ia.avatar_id,
				ga.model_id AS model_id_avatar
			FROM filtered_inventory fi
			INNER JOIN inventory.inventory_avatar ia
				ON fi.id = ia.inventory_id
			INNER JOIN game.avatar ga 
				ON ga.id = ia.avatar_id
			WHERE ia.is_equipped = TRUE
		),
		cte_pet AS (
			SELECT 
				ip.inventory_id AS id,
				ip.pet_id,
				gp.model_id AS model_id_pet
			FROM filtered_inventory fi
			INNER JOIN inventory.inventory_pet ip
				ON fi.id = ip.inventory_id
			INNER JOIN game.pet gp 
				ON gp.id = ip.pet_id
			WHERE ip.is_equipped = TRUE
		),
		cte_item AS (
			SELECT 
				ii.inventory_id AS id,
				ib.template_path,
				ib.badge_description
			FROM filtered_inventory fi
			INNER JOIN inventory.inventory_item ii
				ON fi.id = ii.inventory_id
			INNER JOIN item.item it 
				ON ii.item_id = it.id AND it.type = 'badge'
			LEFT JOIN item.badge ib 
				ON ii.item_id = ib.item_id
			WHERE ii.is_equipped = TRUE
		)
		SELECT
			ca.avatar_id,
			ca.model_id_avatar,
			cp.pet_id,
			cp.model_id_pet,
			ci.template_path,
			ci.badge_description
		FROM cte_item ci
		LEFT JOIN cte_avatar ca 
			ON ci.id = ca.id
		LEFT JOIN cte_pet cp 
			ON ci.id = cp.id
	`

	args := []interface{}{userID}
	profile := constant.InventoryProfile{}
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&profile)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}

		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &profile, nil
}
