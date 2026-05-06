package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentItemListGetByParams(filter constant.ItemFilter) ([]constant.ItemEntity, error) {
	stm := `
	WITH user_subquery AS (
		SELECT
			u.id,
			u.first_name,
			u.last_name,
			u.first_name || ' ' || u.last_name AS fullname
		FROM "user".user AS u
	)
	SELECT DISTINCT ON ("reward"."id")
		reward.id,
		reward.item_id,
		item.type,
		item.image_url,
		item.name,
		item.description,
		reward.status,
		reward.amount,
		reward.created_at,
		u.fullname AS created_by,
		reward.updated_at

	FROM teacher_item.teacher_reward_transaction as reward
	INNER JOIN "class".class AS c ON c.id = reward.class_id
	INNER JOIN subject.subject_teacher AS st ON st.subject_id = reward.subject_id AND st.teacher_id = reward.teacher_id
	INNER JOIN curriculum_group.seed_year AS sy ON sy.short_name = c."year"
	INNER JOIN curriculum_group.year AS y ON y.seed_year_id = sy.id
	INNER JOIN item.item AS item ON item.id = reward.item_id
	INNER JOIN user_subquery AS u ON u.id = reward.created_by
	WHERE reward.student_id = $1 AND
		c.academic_year = $2
	`

	closingQuery := "ORDER BY reward.id ASC"
	args := []interface{}{
		filter.Student.UserId,
		filter.AcademicYear,
	}

	queryBuilder := helper.NewQueryBuilder(stm, args...)

	if len(filter.Search) != 0 {
		searhCols := []string{
			"item.type",
			"item.description",
			"reward.status",
			"reward.amount",
			"u.fullname",
			"u.first_name",
			"u.last_name",
		}
		queryBuilder.ApplySearch(searhCols, filter.Search)
	}

	if filter.StartDate != nil {
		queryBuilder.AddFilter("AND reward.created_at >=", filter.StartDate)
	}

	if filter.EndDate != nil {
		queryBuilder.AddFilter("AND reward.created_at <=", filter.EndDate)
	}

	if filter.CurriculumGroupId != 0 {
		queryBuilder.AddFilter("AND y.curriculum_group_id =", filter.CurriculumGroupId)
	}

	if filter.SubjectId != 0 {
		queryBuilder.AddFilter("AND st.subject_id =", filter.SubjectId)
	}

	queryBuilder.AddClosingQuery(closingQuery)
	query, args := queryBuilder.Build()

	var items []constant.ItemEntity
	if err := postgresRepository.Database.Select(&items, query, args...); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return items, nil
}
