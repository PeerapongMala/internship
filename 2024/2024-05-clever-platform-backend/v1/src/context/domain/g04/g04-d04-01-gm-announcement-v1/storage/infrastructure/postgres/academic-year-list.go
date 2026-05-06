package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) AcademicYearList(pagination *helper.Pagination) ([]constant.AcademicYearResponse, int, error) {
	query := `
	SELECT academic_year FROM (
    SELECT academic_year FROM announcement.announcement_event
    UNION
    SELECT academic_year FROM announcement.announcement_reward
    UNION
    SELECT academic_year FROM announcement.announcement_system
	) 
	ORDER BY academic_year DESC
	LIMIT $1 OFFSET $2
	`
	rows, err := postgresRepository.Database.Query(query, pagination.Limit, pagination.Offset)
	if err != nil {
		return nil, 0, err
	}
	responses := []constant.AcademicYearResponse{}
	for rows.Next() {
		response := constant.AcademicYearResponse{}
		rows.Scan(
			&response.AcaademicYear,
		)
		responses = append(responses, response)

	}
	countQuery := `
	SELECT COUNT(*)
	FROM "school"."seed_academic_year"
	`
	var totalCount int
	err = postgresRepository.Database.QueryRow(countQuery).Scan(&totalCount)
	if err != nil {
		return nil, 0, err
	}
	return responses, totalCount, nil
}
