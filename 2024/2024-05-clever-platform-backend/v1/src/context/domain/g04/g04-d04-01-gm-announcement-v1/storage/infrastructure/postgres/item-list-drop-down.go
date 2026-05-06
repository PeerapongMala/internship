package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) ItemDropDown(pagination *helper.Pagination, req constant.ItemDropDownRequest) ([]constant.ItemListDropDown, int, error) {
	query := `
	SELECT 
  "i"."id", 
  "i"."type",
  "i"."name",
  "i"."description",
  "i"."image_url"
FROM 
  "item"."item" i
WHERE 
  "i"."teacher_item_group_id" IS NULL
AND "i"."status" = 'enabled'
	`
	args := []interface{}{}
	argI := 1
	if req.Type != "" {
		query += fmt.Sprintf(` AND "i"."type" = $%d`, argI)
		args = append(args, req.Type)
		argI++
	}
	if req.Id != 0 {
		query += fmt.Sprintf(` AND "i"."id" = $%d`, argI)
		args = append(args, req.Id)
		argI++
	}
	if req.Name != "" {
		query += fmt.Sprintf(` AND "i"."name" ILIKE $%d`, argI)
		args = append(args, "%"+req.Name+"%")
		argI++
	}
	query += fmt.Sprintf(` ORDER BY "i"."id" LIMIT $%d OFFSET $%d`, argI, argI+1)
	args = append(args, pagination.Limit, pagination.Offset)
	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.ItemListDropDown{}
	for rows.Next() {
		response := constant.ItemListDropDown{}
		err := rows.StructScan(&response)
		if err != nil {
			return nil, 0, err
		}
		responses = append(responses, response)
	}
	countQuery := `
	SELECT COUNT (*)
	FROM 
  "item"."item" i
	WHERE 
  	"i"."teacher_item_group_id" IS NULL
	`
	countArgs := []interface{}{}
	countI := 1
	if req.Type != "" {
		countQuery += fmt.Sprintf(` AND "i"."type" = $%d`, countI)
		countArgs = append(countArgs, req.Type)
		countI++
	}
	if req.Id != 0 {
		countQuery += fmt.Sprintf(` AND "i"."id" = $%d`, countI)
		countArgs = append(countArgs, req.Id)
		countI++
	}
	if req.Name != "" {
		countQuery += fmt.Sprintf(` AND "i"."name" ILIKE $%d`, countI)
		countArgs = append(countArgs, "%"+req.Name+"%")
		countI++
	}
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery, countArgs...).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil

}
