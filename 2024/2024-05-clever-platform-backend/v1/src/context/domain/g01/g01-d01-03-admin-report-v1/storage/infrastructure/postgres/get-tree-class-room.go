package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetTreeClassRoom(schoolId int, year, startDate, endDate string, academicYear int) ([]constant.TreeDistrictData, error) {

	query := `
		SELECT 
			student_stat.class_id AS id,
			student_stat.class_name AS name,
			AVG(total_star) AS avg_star_count,
			MAX(total_star) AS max_star_count,
			AVG(total_level) AS avg_pass_level
		FROM
			(
			SELECT
				c.id AS class_id,
				CONCAT(c.year, '/', c.name) AS class_name,
				CASE 
    				WHEN c.name ~ '^[0-9]+$' THEN CAST(c.name AS INTEGER)
    				WHEN c.name ~ '[0-9]+$' THEN CAST(SUBSTRING(c.name FROM '([0-9]+)$') AS INTEGER)
    				ELSE 0 
				END AS class_number,
				cs.student_id,
				COALESCE(SUM(lpl.star), 0) AS total_star,
				COALESCE(
					SUM(
						CASE
							WHEN lpl.star > 0 THEN 1
							ELSE 0
						END
					),
					0
				) AS total_level
			FROM class.class c
				LEFT JOIN school.class_student cs ON c.id = cs.class_id
				LEFT JOIN level.level_play_log lpl ON cs.student_id = lpl.student_id
				AND cs.class_id = lpl.class_id
				AND lpl.played_at BETWEEN $1 AND $2
			WHERE c.school_id = $3
				AND c.year = $4
				AND c.academic_year = $5
			GROUP BY c.id,
				c.year,
				cs.student_id
		) AS student_stat
		GROUP BY
			student_stat.class_id,
			student_stat.class_name,
			student_stat.class_number
		ORDER BY student_stat.class_number
	`

	var entities []constant.TreeDistrictDataEntity
	err := postgresRepository.Database.Select(&entities, query, startDate, endDate, schoolId, year, academicYear)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []constant.TreeDistrictData{}
	for _, entity := range entities {
		resp = append(resp, constant.TreeDistrictData{
			ClassRoomId:  helper.Deref(entity.Id),
			SchoolId:     schoolId,
			Name:         helper.Deref(entity.Name),
			Type:         "ClassRoom",
			MaxStarCount: helper.Deref(entity.MaxStarCount),
			AvgStarCount: helper.Deref(entity.AvgStarCount),
			AvgPassLevel: helper.Deref(entity.AvgPassLevel),
		})
	}

	return resp, nil
}
