package postgres

import (
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateItemBadge(item *constant.ItemBadgeRequest) (*constant.ItemBadgeResponse, error) {
	response := constant.ItemBadgeResponse{}

	updateQuery := `UPDATE "item"."badge" SET `
	columns := []string{}
	values := []interface{}{}

	if item.BadgeDescription != nil {
		columns = append(columns, "badge_description = $"+strconv.Itoa(len(values)+1))
		values = append(values, item.BadgeDescription)
	}
	if item.TemplatePath != nil {
		columns = append(columns, "template_path = $"+strconv.Itoa(len(values)+1))
		values = append(values, item.TemplatePath)
	}
	// Combine columns with comma separator
	updateQuery += strings.Join(columns, ", ")

	// Add WHERE clause with parameterized placeholders for subject_id and day
	updateQuery += ` WHERE item_id = $` + strconv.Itoa(len(values)+1) + ` RETURNING *`

	// Add subject_id and day to the values slice
	values = append(values, item.ItemId)

	err := postgresRepository.Database.Get(&response, updateQuery, values...)

	if err != nil {
		return nil, err
	}

	return &response, nil
}
