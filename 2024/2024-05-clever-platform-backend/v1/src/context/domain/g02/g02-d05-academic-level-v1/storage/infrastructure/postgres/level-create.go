package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelCreate(tx *sqlx.Tx, level *constant.LevelEntity) (*constant.LevelEntity, error) {
	query := `
		INSERT INTO "level"."level" (
			"sub_lesson_id",
			"index",
			"bloom_type",
			"question_type",
			"level_type",
			"difficulty",
			"lock_next_level",
			"timer_type",
			"timer_time",
			"status",
			"wizard_index",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by",
			"admin_login_as"
		)	
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
		RETURNING *
	`
	levelEntity := constant.LevelEntity{}
	err := tx.QueryRowx(
		query,
		level.SubLessonId,
		level.Index,
		level.BloomType,
		level.QuestionType,
		level.LevelType,
		level.Difficulty,
		level.LockNextLevel,
		level.TimerType,
		level.TimerTime,
		level.Status,
		level.WizardIndex,
		level.CreatedAt,
		level.CreatedBy,
		level.UpdatedAt,
		level.UpdatedBy,
		level.AdminLoginAs,
	).StructScan(&levelEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	subCriteriaQuery := `
		INSERT INTO "level"."level_sub_criteria_topic" (
			"level_id",
			"sub_criteria_topic_id"
		)
		VALUES ($1, $2)
	`
	for _, subCriteriaTopicId := range level.SubCriteriaTopicIds {
		if subCriteriaTopicId != 0 {
			_, err := tx.Exec(subCriteriaQuery, levelEntity.Id, subCriteriaTopicId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}
		}
	}
	levelEntity.SubCriteriaTopicIds = append([]int{}, level.SubCriteriaTopicIds...)
	levelEntity.TagIds = append([]int{}, level.TagIds...)

	tagQuery := `
		INSERT INTO "level"."level_tag" (
			"level_id",
			"tag_id"	
		)	
		VALUES ($1, $2)
	`
	for _, tagId := range level.TagIds {
		if tagId != 0 {
			_, err := tx.Exec(tagQuery, levelEntity.Id, tagId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return nil, err
			}
		}
	}

	return &levelEntity, nil
}
