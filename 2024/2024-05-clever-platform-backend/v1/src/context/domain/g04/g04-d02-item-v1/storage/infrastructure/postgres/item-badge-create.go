package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
)

func (postgresRepository *postgresRepository) CreateItemBadge(item *constant.ItemBadgeRequest) (*constant.ItemBadgeResponse, error) {
	response := &constant.ItemBadgeResponse{}
	err := postgresRepository.Database.Get(response, `
	INSERT INTO
	"item"."badge"
	(
	item_id,
	template_path,
	badge_description
	)
	VALUES
	(
		$1,
		$2,
		$3
	)
	RETURNING *
	`,
		item.ItemId,
		item.TemplatePath,
		item.BadgeDescription,
	)
	if err != nil {
		return nil, err
	}

	return response, nil
}
