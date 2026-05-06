package postgres

import (
	"fmt"
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetListHomeWorkByUserData(subjectId *int, studentData constant.StudentData, userId string) ([]constant.HomeWorkListByUserDataEntity, error) {
	query := `
		WITH "school" AS (
		    SELECT "school_id"
		    FROM "user"."student" stu
			WHERE "stu"."user_id" = $4
		)	
		SELECT DISTINCT
			h.id AS homework_id,
			h.subject_id AS subject_id,
			ht.id AS homework_template_id,
			h.name AS home_work_name,
			h.due_at AS due_at,
			h.closed_at AS closed_at
		FROM homework.homework h 
		LEFT JOIN homework.homework_template ht 
			ON h.homework_template_id = ht.id
		LEFT JOIN school.school_teacher st 
			ON st.user_id = ht.teacher_id
		LEFT JOIN homework.homework_assigned_to_year haty 
			ON h.id = haty.homework_id 
		LEFT JOIN homework.homework_assigned_to_class hatc 
			ON h.id = hatc.homework_id
		LEFT JOIN homework.homework_assigned_to_study_group hatsg
			ON h.id = hatsg.homework_id
		LEFT JOIN curriculum_group.seed_year sy 
			ON haty.seed_year_id = sy.id
		LEFT JOIN class.class c 
			ON (c.school_id = st.school_id AND c.year = sy.short_name)
		LEFT JOIN class.study_group sg 
			ON sg.class_id = hatc.class_id
		INNER JOIN "school" sch
			ON "sch"."school_id" = st.school_id
		WHERE h.status = 'enabled'
		AND (
			hatsg.study_group_id = ANY($1)
			OR hatc.class_id = ANY($2)
			OR sy.short_name = ANY($3)
		)
		AND "h"."started_at" <= $5
	`

	args := []interface{}{studentData.StudentGroupId, studentData.ClassId, studentData.YearName, userId, time.Now().UTC()}
	argsIndex := len(args) + 1
	if subjectId != nil {
		args = append(args, subjectId)
		query += fmt.Sprintf(" AND h.subject_id = $%d", argsIndex)
		argsIndex++
	}

	entities := []constant.HomeWorkListByUserDataEntity{}
	//err := postgresRepository.Database.Select(&entities, query, subjectId, studentData.StudentGroupId, studentData.ClassId, studentData.YearName, userId, time.Now().UTC())
	err := postgresRepository.Database.Select(&entities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
