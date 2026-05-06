package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) SchoolItemDropDown(pagination *helper.Pagination, req constant.ItemDropDownRequest) ([]constant.ItemListDropDown, int, error) {
	query := `
		 

		SELECT 
 		 "i"."id", 
 		 "i"."type",
 		 "i"."name",
 		 "i"."description",
 		 "i"."image_url"
		FROM 
 		 "item"."item" i
		LEFT JOIN "teacher_item"."teacher_item_group" tig
  			ON "i"."teacher_item_group_id" = "tig"."id"
		LEFT JOIN "subject"."subject" s
  			ON "tig"."subject_id" = "s"."id"
		LEFT JOIN "school"."school_teacher" scht
  			ON "tig"."teacher_id" = "scht"."user_id"
		LEFT JOIN "school"."school" sch
  			ON "scht"."school_id" = "sch"."id"
		WHERE 
  			"sch"."id" = $1 
  			AND "s"."id" = $2
			AND "i"."status" = 'enabled'
		`
	args := []interface{}{req.SchoolId, req.SubjectId}
	argI := 3
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
		SELECT 	COUNT(*)
		FROM 
    "item"."item" i
 	 LEFT JOIN "teacher_item"."teacher_item_group" tig
  	  ON "i"."teacher_item_group_id" = "tig"."subject_teacher_id"
  	LEFT JOIN "subject"."subject_teacher" st
   	 ON "tig"."subject_teacher_id" = "st"."id"
  	LEFT JOIN "subject"."subject" s
   	 ON "st"."subject_id" = "s"."id"
  	LEFT JOIN "school"."school_teacher" scht
   	 ON "st"."teacher_id" = "scht"."user_id"
  	LEFT JOIN "school"."school" sch
    	ON "scht"."school_id" = "sch"."id"
  	WHERE 
    	"sch"."id" = $1 
    	AND "s"."id" = $2
		`
	countArgs := []interface{}{req.SchoolId, req.SubjectId}
	countI := 3
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
