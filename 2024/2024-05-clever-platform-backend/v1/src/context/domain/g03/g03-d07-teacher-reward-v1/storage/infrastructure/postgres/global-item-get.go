package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"

func (postgresRepository *postgresRepository) GetGlobalItem() ([]constant.ItemList, error) {
	query := `
	SELECT
	id,
	name
	FROM "item"."item"
	WHERE teacher_item_group_id IS NULL
	`
	response := []constant.ItemList{}
	err := postgresRepository.Database.Select(&response, query)
	if err != nil {
		return nil, err
	}
	return response, nil
}
