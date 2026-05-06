package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
)

func (postgresRepository *postgresRepository) GetItemBadge(itemId int) (*constant.ItemAndBadgeResponse, error) {
	badges := constant.ItemAndBadgeResponse{}
	badges.Badge = constant.ItemBadgeResponse{}
	query := `
			SELECT 
			"item"."id",
			"item"."type",
			"item"."name",
			"item"."description",
			"item"."image_url",
			"item"."status",
			"item"."created_at",
			u2."first_name" AS "created_name",
			"item"."updated_at",
			"item"."created_by",
			u."first_name" AS "updated_by",
			"item"."id" AS item_id,
			badge.badge_description,
			badge.template_path
			FROM "item"."item" 
			LEFT JOIN "user"."user" u ON "item"."item".updated_by = u.id
			LEFT JOIN "user"."user" u2 ON "item"."item".created_by = u2.id
			LEFT JOIN "item"."badge" badge ON "item"."item".id = badge.item_id
			WHERE "item".id = $1`
	err := postgresRepository.Database.QueryRowx(query, itemId).Scan(
		&badges.Id,
		&badges.Type,
		&badges.Name,
		&badges.Description,
		&badges.ImageUrl,
		&badges.Status,
		&badges.CreateAt,
		&badges.CreateName,
		&badges.UpdateAt,
		&badges.CreateBy,
		&badges.UpdateBy,
		&badges.Badge.ItemId,
		&badges.BadgeDescription,
		&badges.TemplatePath,
	)

	if err != nil {
		return nil, err
	}

	return &badges, nil
}
