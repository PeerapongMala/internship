package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetStudentData(userId string) (*constant.StudentData, error) {
	query := `
		SELECT 
			c.id as class_id,
			sg.id as student_group_id,
			c."year" as year_name
		FROM class.class c
		LEFT JOIN school.class_student cs
		    ON cs.class_id = c.id
		LEFT JOIN class.study_group sg 
		  ON sg.class_id = c.id 
		LEFT JOIN class.study_group_student sgs 
		  ON sg.id = sgs.study_group_id
		WHERE cs.student_id = $1
	`

	entities := []constant.StudentDataEntity{}
	err := postgresRepository.Database.Select(&entities, query, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	var studentGroupId, classId []int
	var yearName []string

	for _, entity := range entities {
		if entity.StudentGroupId != nil {
			studentGroupId = append(studentGroupId, *entity.StudentGroupId)
		}

		if entity.ClassId != nil {
			classId = append(classId, *entity.ClassId)
		}

		if entity.YearName != nil {
			yearName = append(yearName, *entity.YearName)
		}
	}

	resp := constant.StudentData{
		StudentGroupId: helper.RemoveDuplicate(studentGroupId),
		ClassId:        helper.RemoveDuplicate(classId),
		YearName:       helper.RemoveDuplicate(yearName),
	}

	return &resp, nil
}

func (postgresRepository *postgresRepository) GetStudentDataDetail(studentId string) (*constant.StudentDataDetailEntity, error) {
	query := `
		SELECT 
			c.id AS class_id,
			s.id AS school_id,
			sas.school_affiliation_id AS school_affiliation_id
		FROM class.class c
		LEFT JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
		LEFT JOIN school.school s ON s.id = c.school_id 
		LEFT JOIN school_affiliation.school_affiliation_school sas ON sas.school_id = s.id
		WHERE cs.student_id = $1
		ORDER BY c.academic_year DESC
		LIMIT 1
	`

	var entity constant.StudentDataDetailEntity
	err := postgresRepository.Database.QueryRowx(query, studentId).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
