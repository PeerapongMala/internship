package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d06-teacher-homework-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetHomeworkAssignedData(id int) (*constant.AssignedToEntity, error) {

	query := `
		SELECT
			ARRAY_AGG(DISTINCT hatc.class_id) AS class_ids,
			ARRAY_AGG(DISTINCT hatsg.study_group_id) AS study_group_ids,
			ARRAY_AGG(DISTINCT haty.seed_year_id) AS seed_year_ids
		FROM homework.homework h
		LEFT JOIN homework.homework_assigned_to_class hatc
			ON hatc.homework_id = h.id 
			AND h.id = $1
		LEFT JOIN homework.homework_assigned_to_study_group hatsg 
			ON hatsg.homework_id = h.id
			AND h.id = $1
		LEFT JOIN homework.homework_assigned_to_year haty
			ON haty.homework_id = h.id
			AND h.id = $1
	`

	var entity constant.AssignedDataEntity
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	resp := constant.AssignedToEntity{
		ClassIds:      helper.ConvertPgtypeInt4ToInt(entity.ClassIds),
		StudyGroupIds: helper.ConvertPgtypeInt4ToInt(entity.StudyGroupIds),
		SeedYearIds:   helper.ConvertPgtypeInt4ToInt(entity.SeedYearIds),
	}

	return &resp, nil
}
