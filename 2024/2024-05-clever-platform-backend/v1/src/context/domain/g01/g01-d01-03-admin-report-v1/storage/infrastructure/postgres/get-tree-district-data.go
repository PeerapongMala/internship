package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetTreeDistrictZoneBkk(startDate, endDate string) ([]constant.TreeDistrictData, error) {

	query := `
		SELECT 
			district_zone AS name,
			AVG(total_star) AS avg_star_count,
			MAX(total_star) AS max_star_count,
			AVG(total_level) AS avg_pass_level
		FROM (
			SELECT 
					student_id,
					district_zone,
					SUM(star) AS total_star,
					COUNT(DISTINCT level_id) AS total_level
			FROM (
				SELECT DISTINCT lpl.student_id, lpl.played_at, sad.district_zone, lpl.level_id, MAX(lpl.star) AS star
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

	var entities []constant.TreeDistrictDataEntity
	err := postgresRepository.Database.Select(&entities, query, startDate, endDate)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []constant.TreeDistrictData{}
	for _, entity := range entities {
		resp = append(resp, constant.TreeDistrictData{
			Name:         helper.Deref(entity.Name),
			Type:         "DistrictZone",
			MaxStarCount: helper.Deref(entity.MaxStarCount),
			AvgStarCount: helper.Deref(entity.AvgStarCount),
			AvgPassLevel: helper.Deref(entity.AvgPassLevel),
		})
	}

	return resp, nil
}

func (postgresRepository *postgresRepository) GetTreeDistrictBkk(districtZone, startDate, endDate string) ([]constant.TreeDistrictData, error) {

	query := `
		SELECT 
			district AS name,
			AVG(total_star) AS avg_star_count,
			MAX(total_star) AS max_star_count,
			AVG(total_level) AS avg_pass_level
		FROM (
			SELECT 
					student_id,
					district,
					SUM(star) AS total_star,
					COUNT(DISTINCT level_id) AS total_level
			FROM (
				SELECT lpl.student_id, lpl.played_at, s2.district, lpl.level_id, MAX(lpl.star) AS star
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
				AND sad.district_zone = $3
				GROUP BY lpl.student_id, lpl.played_at, s2.district, lpl.level_id
			) AS distinct_lpl
			GROUP BY distinct_lpl.student_id, district
		) AS final_query
		GROUP BY district;
	`

	var entities []constant.TreeDistrictDataEntity
	err := postgresRepository.Database.Select(&entities, query, startDate, endDate, districtZone)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []constant.TreeDistrictData{}
	for _, entity := range entities {
		resp = append(resp, constant.TreeDistrictData{
			Name:         helper.Deref(entity.Name),
			Type:         "District",
			MaxStarCount: helper.Deref(entity.MaxStarCount),
			AvgStarCount: helper.Deref(entity.AvgStarCount),
			AvgPassLevel: helper.Deref(entity.AvgPassLevel),
		})
	}

	return resp, nil
}

func (postgresRepository *postgresRepository) GetTreeDistrict(province, startDate, endDate string) ([]constant.TreeDistrictData, error) {

	query := `
		SELECT 
			student_stat.district AS name,
			AVG(total_star) AS avg_star_count,
			MAX(total_star) AS max_star_count,
			AVG(total_level) AS avg_pass_level
		FROM
			(SELECT
				s.district,
				cs.student_id,
				COALESCE(SUM(lpl.star), 0) AS total_star,
				COALESCE(SUM(CASE
					WHEN lpl.star > 0 THEN 1
					ELSE 0
				END), 0) AS total_level
			FROM
				"school"."school" s
			LEFT JOIN
				class.class c ON "s"."id" = "c"."school_id"
			LEFT JOIN
				school.class_student cs ON c.id = cs.class_id
			LEFT JOIN
				level.level_play_log lpl ON cs.student_id = lpl.student_id
				AND cs.class_id = lpl.class_id
				AND lpl.played_at BETWEEN $1 AND $2
			WHERE
				s.province = $3
			GROUP BY
				s.district,
				cs.student_id
		) AS student_stat
		GROUP BY
			student_stat.district
	`

	var entities []constant.TreeDistrictDataEntity
	err := postgresRepository.Database.Select(&entities, query, startDate, endDate, province)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []constant.TreeDistrictData{}
	for _, entity := range entities {
		resp = append(resp, constant.TreeDistrictData{
			Name:         helper.Deref(entity.Name),
			Type:         "District",
			MaxStarCount: helper.Deref(entity.MaxStarCount),
			AvgStarCount: helper.Deref(entity.AvgStarCount),
			AvgPassLevel: helper.Deref(entity.AvgPassLevel),
		})
	}

	return resp, nil
}
