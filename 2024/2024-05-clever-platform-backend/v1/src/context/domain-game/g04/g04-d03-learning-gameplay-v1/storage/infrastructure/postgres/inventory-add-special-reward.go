package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) InventoryAddSpecialReward(tx *sqlx.Tx, userId string, specialRewards []constant.SpecialReward) error {
	if len(specialRewards) == 0 {
		return nil
	}

	args := []interface{}{userId}
	query := []string{}
	for i, specialReward := range specialRewards {
		query = append(query, fmt.Sprintf(` SELECT "inventory"."id", $%d::integer, $%d::integer, $%d::boolean FROM inventory`, i*3+2, i*3+3, i*3+4))
		args = append(args, specialReward.ItemId, specialReward.Amount, false)
	}

	baseQuery := fmt.Sprintf(`
		WITH inventory AS (
			SELECT "id" FROM "inventory"."inventory" WHERE "student_id" = $1
		)
		INSERT INTO "inventory"."inventory_item" (
			"inventory_id",
			"item_id",
			"amount",
			"is_equipped"
		)
		%s
		ON CONFLICT (inventory_id, item_id)
		DO UPDATE SET
			"amount" = "inventory_item"."amount" + EXCLUDED.amount
	`, strings.Join(query, " UNION ALL "))

	_, err := postgresRepository.Database.Exec(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
