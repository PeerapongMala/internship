package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetInventoryByStudentId(studentId *string) (*constant.InventoryEntity, error) {
	query := `
		SELECT 
			id,
			student_id,
			gold_coin,
			arcade_coin,
			ice
		FROM
			inventory.inventory
		WHERE student_id = $1
	`

	var entity constant.InventoryEntity
	err := postgresRepository.Database.QueryRowx(query, studentId).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
