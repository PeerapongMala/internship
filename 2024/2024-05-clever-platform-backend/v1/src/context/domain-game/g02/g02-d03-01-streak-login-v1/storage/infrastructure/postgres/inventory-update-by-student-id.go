package postgres

import (
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateInventoryByStudentId(request *constant.InventoryEntity) (*constant.InventoryEntity, error) {
	inventory := constant.InventoryEntity{}

	updateQuery := `
		UPDATE "inventory"."inventory"
		SET 
	`
	columns := []string{}
	values := []interface{}{}
	// exam 	if subjectReward.ItemId != 0 {
	// 	columns = append(columns, "item_id = $"+strconv.Itoa(len(values)+1))
	// 	values = append(values, subjectReward.ItemId)
	// }
	if request.GoldCoin != nil {
		columns = append(columns, "gold_coin = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.GoldCoin)
	}
	if request.ArcadeCoin != nil {
		columns = append(columns, "arcade_coin = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.ArcadeCoin)
	}
	if request.Ice != nil {
		columns = append(columns, "ice = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.Ice)
	}

	updateQuery += strings.Join(columns, ", ")

	// Add WHERE clause with parameterized placeholders for subject_id and day
	updateQuery += ` WHERE student_id = $` + strconv.Itoa(len(values)+1) + ` RETURNING *`

	// Add subject_id and day to the values slice
	values = append(values, request.StudentId)

	// Execute the query
	err := postgresRepository.Database.Get(&inventory, updateQuery, values...)
	if err != nil {
		return nil, err
	}

	return &inventory, nil

}

func (postgresRepository *postgresRepository) UpdateCoinInventory(request *constant.InventoryDTO) (error) {
	
	query := `
	UPDATE "inventory"."inventory"
	SET arcade_coin = arcade_coin + $1,
		gold_coin = gold_coin + $2,
		ice = ice + $3
	WHERE student_id = $4;
	`

	err := postgresRepository.Database.QueryRowx(
		query,
		request.ArcadeCoin,
		request.GoldCoin,
		request.IceAmount,
		request.StudentId,
	).Err()

	if err != nil {
		return err
	}

	return nil
}