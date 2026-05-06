package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetTargetsSeedYearShortNameByIds(seedYearIds []int) ([]string, error) {
	query := `
		SELECT DISTINCT sy.short_name 
		FROM curriculum_group.seed_year sy 
		WHERE sy.id = ANY($1)
		ORDER BY sy.short_name ASC 
	`

	rows, err := postgresRepository.Database.Queryx(query, seedYearIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []string{}
	for rows.Next() {
		var seedYearShortName string
		err := rows.Scan(&seedYearShortName)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		resp = append(resp, seedYearShortName)
	}

	return resp, nil
}

func (postgresRepository *postgresRepository) GetTargetsClassRoomNameByIds(classRoomIds []int) ([]string, error) {
	query := `
	SELECT concat(c."year", ' ห้อง ', c.name)
	FROM "class".CLASS c
	WHERE c.id = ANY($1)
	ORDER BY c.id
`

	rows, err := postgresRepository.Database.Queryx(query, classRoomIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []string{}
	for rows.Next() {
		var className string
		err := rows.Scan(&className)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		resp = append(resp, className)
	}

	return resp, nil
}

func (postgresRepository *postgresRepository) GetTargetsStudyGroupNameByIds(studyGroupIds []int) ([]string, error) {
	query := `
		SELECT concat(c."year", ' ห้อง ', c.name, ' กลุ่ม ', sg."name") 
		FROM "class".study_group sg
		LEFT JOIN "class"."class" c 
		ON c.id = sg.class_id 
		WHERE sg.id = ANY($1)
		ORDER BY sg.id
`

	rows, err := postgresRepository.Database.Queryx(query, studyGroupIds)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := []string{}
	for rows.Next() {
		var className string
		err := rows.Scan(&className)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		resp = append(resp, className)
	}

	return resp, nil
}
