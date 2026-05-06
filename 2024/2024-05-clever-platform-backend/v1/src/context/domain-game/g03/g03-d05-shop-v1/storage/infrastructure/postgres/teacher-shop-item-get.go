package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TeacherShopItemGetLimit(shopItemId int) (*int, error) {
	query := `
		SELECT
			"limit_per_user"
		FROM "teacher_store"."teacher_store_item"
		WHERE "id" = $1
	`
	var limitPerUser *int
	err := postgresRepository.Database.QueryRowx(query, shopItemId).Scan(&limitPerUser)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return limitPerUser, nil
}
