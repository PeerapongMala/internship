package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) SchoolAcademicYear(schoolId int, pagination *helper.Pagination) ([]constant.AcademicYearResponse, error) {
	query := `
	SELECT DISTINCT
	academic_year
	FROM "class"."class"
	WHERE school_id = $1
	ORDER BY academic_year DESC
	`

	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)

	err := postgresRepository.Database.QueryRow(countQuery, schoolId).Scan(&pagination.TotalCount)
	if err != nil {
		return nil, err
	}
	response := []constant.AcademicYearResponse{}
	err = postgresRepository.Database.Select(&response, query, schoolId)
	if err != nil {
		return nil, err
	}
	return response, nil
}
