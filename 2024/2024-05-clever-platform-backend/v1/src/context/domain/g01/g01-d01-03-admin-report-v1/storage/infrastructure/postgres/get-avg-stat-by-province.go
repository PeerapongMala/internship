package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetAvgStatBKK(startDate, endDate string) ([]constant.AvgStatByProvinceEntity, error) {

	query := `
		SELECT 
			district_zone AS district,
			AVG(total_star) AS avg_total_star,
			SUM(total_star) AS sum_total_star
		FROM (
			SELECT 
					student_id,
					district_zone,
					SUM(star) AS total_star
			FROM (
				SELECT lpl.student_id, lpl.played_at, sad.district_zone, lpl.level_id, MAX(lpl.star) AS star
				FROM "level".level_play_log lpl 
				LEFT JOIN "user".student s 
					ON s.user_id = lpl.student_id 
				LEFT JOIN school.school s2 
				ON s2.id = s.school_id 
				LEFT JOIN school_affiliation.school_affiliation_school sas
				ON sas.school_id = s2.id
				LEFT JOIN school_affiliation.school_affiliation_doe sad
				ON sad.school_affiliation_id = sas.school_affiliation_id 
				WHERE lpl.played_at BETWEEN $1 AND $2
				AND s2.province = 'กรุงเทพมหานคร'
				GROUP BY lpl.student_id, lpl.played_at, sad.district_zone, lpl.level_id
			) AS distinct_lpl
			GROUP BY distinct_lpl.student_id, distinct_lpl.district_zone
		) AS final_query
		GROUP BY district_zone;
	`

	var entities []constant.AvgStatByProvinceEntity
	err := postgresRepository.Database.Select(&entities, query, startDate, endDate)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}

func (postgresRepository *postgresRepository) GetAvgStatByProvince(province, startDate, endDate string) ([]constant.AvgStatByProvinceEntity, error) {

	query := `
		SELECT
			"sc"."district",
			COALESCE(SUM("lpl"."star"), 0)::FLOAT / 
    		NULLIF(COUNT(DISTINCT "s"."user_id"), 0) AS "avg_total_star"
		FROM "school"."school" sc
		LEFT JOIN "user"."student" s ON "sc"."id" = "s"."school_id"
		LEFT JOIN "level"."level_play_log" lpl ON "s"."user_id" = "lpl"."student_id"
			AND "lpl"."played_at" BETWEEN $1 AND $2
		WHERE "sc"."province" = $3
		GROUP BY "sc"."district"
	`

	var entities []constant.AvgStatByProvinceEntity
	err := postgresRepository.Database.Select(&entities, query, startDate, endDate, province)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
