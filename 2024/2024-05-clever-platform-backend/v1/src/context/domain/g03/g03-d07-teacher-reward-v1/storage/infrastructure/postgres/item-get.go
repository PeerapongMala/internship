package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"

func (postgresRepository *postgresRepository) ItemGet(itemId int) (*constant.ItemInfo, error) {
	query := `
	SELECT
	id,
	type,
	name,
	description,
	image_url
	FROM "item"."item"
	WHERE id = $1
	`
	response := constant.ItemInfo{}
	err := postgresRepository.Database.Get(&response, query, itemId)
	if err != nil {
		return nil, err
	}
	return &response, nil
}
