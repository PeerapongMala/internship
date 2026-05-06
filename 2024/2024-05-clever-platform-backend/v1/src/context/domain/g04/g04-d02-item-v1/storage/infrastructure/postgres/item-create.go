package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
)

func (postgresRepository *postgresRepository) CreateItem(item *constant.ItemRequest) (*constant.ItemResponse, error) {
	response := &constant.ItemResponse{}
	err := postgresRepository.Database.Get(response, `
	INSERT INTO
	"item"."item"
	(
		type,
		name,
		description,
		image_url,
		status,
		created_at,
		created_by
	)
	VALUES
	(
		$1,
		$2,
		$3,
		$4,
		$5,
		$6,
		$7
	)
	RETURNING *
	`,
		item.Type,
		item.Name,
		item.Description,
		item.ImageUrl,
		item.Status,
		item.CreateAt,
		item.CreateBy,
	)
	if err != nil {
		return nil, err
	}

	return response, nil
}
