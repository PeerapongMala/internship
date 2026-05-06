package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetSchoolStatsByProvinceAndDistrict(province, district string, academicYear []int) (*constant.SchoolStatsEntity, error) {
	
	query := `
		SELECT 
			count(DISTINCT s.id) AS school_count,
			count(DISTINCT c.id) AS class_room_count,
			count(DISTINCT s2.user_id) AS student_count
		FROM school.school s 
		LEFT JOIN "user".student s2 
		ON s2.school_id = s.id 
		LEFT JOIN "class"."class" c 
		ON c.school_id = s.id
		WHERE s.province = $1
		AND s.district = $2
		AND c.academic_year = ANY($3)
		AND s.status = 'enabled'
		AND c.status = 'enabled'
	`

	var entity constant.SchoolStatsEntity
	err := postgresRepository.Database.QueryRowx(query, province, district, academicYear).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
