package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d06-grade-porphor6-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradePorphor6List(request constant.GradePorphor6ListRequest, pagination *helper.Pagination) (*[]constant.Porphor6ListResponse, error) {
	query := `
		SELECT
			gp6d.id,
			gp6d.learning_area_name,
			gp6d.student_id,
			uu.title,
			uu.first_name,
			uu.last_name,
			gp6d.data_json,
			gp6d.created_at
		FROM
			grade.porphor6_data gp6d
		LEFT JOIN
			user.student us ON gp6d.student_id = us.student_id
		LEFT JOIN
			user.user uu ON us.user_id = uu.user_id
	`
	args := []interface{}{}
	argI := 1
	if request.SearchText != "" {
		query += fmt.Sprintf(` WHERE uu.first_name ILIKE $%d OR uu.last_name ILIKE $%d`, argI, argI+1)
		args = append(args, "%"+request.SearchText+"%", "%"+request.SearchText+"%")
		argI += 2
	}
	query += fmt.Sprintf(` ORDER BY gp6d.id LIMIT $%d OFFSET $%d`, argI, argI+1)
	args = append(args, pagination.Limit, pagination.Offset)

	rows, err := postgresRepository.Database.Query(query, args...)
	if err != nil {
		log.Println(err)
		return nil, errors.New("failed to fetch data")
	}
	defer rows.Close()

	var data []constant.Porphor6ListResponse
	for rows.Next() {
		var d constant.Porphor6ListResponse
		err = rows.Scan(&d.ID, &d.LearningAreaName, &d.StudentID, &d.Title, &d.FirstName, &d.LastName, &d.DataJSON, &d.CreatedAt)
		if err != nil {
			log.Println(err)
			return nil, errors.New("failed to fetch data")
		}
		data = append(data, d)
	}
	return &data, nil
}
