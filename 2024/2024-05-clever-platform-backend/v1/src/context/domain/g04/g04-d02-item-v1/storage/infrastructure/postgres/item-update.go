package postgres

import (
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d02-item-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateItem(item *constant.ItemRequest) (*constant.ItemResponse, error) {
	response := constant.ItemResponse{}

	updateQuery := `UPDATE "item"."item" SET `
	columns := []string{}
	values := []interface{}{}

	if item.Name != nil {
		columns = append(columns, "name = $"+strconv.Itoa(len(values)+1))
		values = append(values, item.Name)
	}
	if item.Description != nil {
		columns = append(columns, "description = $"+strconv.Itoa(len(values)+1))
		values = append(values, item.Description)
	}
	if item.ImageUrl != nil {
		columns = append(columns, "image_url = $"+strconv.Itoa(len(values)+1))
		values = append(values, item.ImageUrl)
	}
	if item.Status != nil {
		columns = append(columns, "status = $"+strconv.Itoa(len(values)+1))
		values = append(values, item.Status)
	}

	columns = append(columns, "updated_at = $"+strconv.Itoa(len(values)+1))
	values = append(values, item.UpdateAt)

	columns = append(columns, "updated_by = $"+strconv.Itoa(len(values)+1))
	values = append(values, item.UpdateBy)

	if item.AdminLoginAs != nil {
		columns = append(columns, "admin_login_as = $"+strconv.Itoa(len(values)+1))
		values = append(values, item.AdminLoginAs)
	}

	// Combine columns with comma separator
	updateQuery += strings.Join(columns, ", ")

	// Add WHERE clause with parameterized placeholders for subject_id and day
	updateQuery += ` WHERE id = $` + strconv.Itoa(len(values)+1) + ` RETURNING *`

	// Add subject_id and day to the values slice
	values = append(values, item.Id)

	err := postgresRepository.Database.Get(&response, updateQuery, values...)

	if err != nil {
		return nil, err
	}

	return &response, nil
}
