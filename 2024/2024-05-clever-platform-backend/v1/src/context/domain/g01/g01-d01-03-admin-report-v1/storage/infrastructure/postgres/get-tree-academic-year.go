package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetTreeAcademicYear(schoolId int, startDate, endDate string) ([]constant.TreeDistrictData, error) {

	query := `
		SELECT 
			student_stat.academic_year AS name,
			student_stat.academic_year AS academic_year,
			AVG(total_star) AS avg_star_count,
			MAX(total_star) AS max_star_count,
			AVG(total_level) AS avg_pass_level
		FROM
			(
			SELECT
				c.academic_year AS academic_year,
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
				AND lpl.played_at  BETWEEN $1 AND $2
			WHERE c.school_id = $3
			GROUP BY c.academic_year, cs.student_id
		) AS student_stat
		GROUP BY
			student_stat.academic_year
	`

	var entities []constant.TreeDistrictDataEntity
	err := postgresRepository.Database.Select(&entities, query, startDate, endDate, schoolId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []constant.TreeDistrictData{}
	for _, entity := range entities {
		resp = append(resp, constant.TreeDistrictData{
			ClassRoomId:  helper.Deref(entity.Id),
			AcademicYear: helper.Deref(entity.AcademicYear),
			SchoolId:     schoolId,
			Name:         "ปีการศึกษา " + helper.Deref(entity.Name),
			Type:         "AcademicYear",
			MaxStarCount: helper.Deref(entity.MaxStarCount),
			AvgStarCount: helper.Deref(entity.AvgStarCount),
			AvgPassLevel: helper.Deref(entity.AvgPassLevel),
		})
	}

	return resp, nil
}
