package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) LevelUpdate(tx *sqlx.Tx, level *constant.LevelUpdateEntity) (*constant.LevelEntity, error) {
	baseQuery := `
		UPDATE "level"."level" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if level.SubLessonId != 0 {
		query = append(query, fmt.Sprintf(` "sub_lesson_id" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.SubLessonId)
	}
	if level.Index != 0 {
		query = append(query, fmt.Sprintf(` "index" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.Index)
	}
	if level.BloomType != 0 {
		query = append(query, fmt.Sprintf(` "bloom_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.BloomType)
	}
	if level.QuestionType != "" {
		query = append(query, fmt.Sprintf(` "question_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.QuestionType)
	}
	if level.LevelType != "" {
		query = append(query, fmt.Sprintf(` "level_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.LevelType)
	}
	if level.Difficulty != "" {
		query = append(query, fmt.Sprintf(` "difficulty" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.Difficulty)
	}
	if level.LockNextLevel != nil {
		query = append(query, fmt.Sprintf(` "lock_next_level" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.LockNextLevel)
	}
	if level.TimerType != "" {
		query = append(query, fmt.Sprintf(` "timer_type" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.TimerType)
	}
	if level.TimerTime != nil {
		query = append(query, fmt.Sprintf(` "timer_time" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.TimerTime)
	}
	if level.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.Status)
	}
	if level.WizardIndex != 0 {
		query = append(query, fmt.Sprintf(` "wizard_index" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.WizardIndex)
	}
	if level.UpdatedAt != nil {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.UpdatedAt)
	}
	if level.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.UpdatedBy)
	}
	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, level.AdminLoginAs)

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, level.Id)

	levelEntity := constant.LevelEntity{}
	err := tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&levelEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	deleteQuery := `
		DELETE FROM "level"."level_sub_criteria_topic"
		WHERE "level_id" = $1	
	`
	insertQuery := `
		INSERT INTO "level"."level_sub_criteria_topic" (
			"level_id",
			"sub_criteria_topic_id"	
		)
		VALUES ($1, $2)
	`
	if level.SubCriteriaTopicIds != nil {
		_, err = tx.Exec(deleteQuery, level.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		for _, subCriteriaTopicId := range level.SubCriteriaTopicIds {
			if subCriteriaTopicId != 0 {
				_, err = tx.Exec(insertQuery, level.Id, subCriteriaTopicId)
				if err != nil {
					log.Printf("%+v", errors.WithStack(err))
					return nil, err
				}
			}
		}
	}

	deleteQuery = `
		DELETE FROM "level"."level_tag"	
		WHERE "level_id" = $1
	`
	insertQuery = `
		INSERT INTO "level"."level_tag"	(
			"level_id",
			"tag_id"	
		)
		VALUES ($1, $2)
	`
	if level.TagIds != nil {
		_, err := tx.Exec(deleteQuery, level.Id)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		for _, tagId := range level.TagIds {
			if tagId != 0 {
				_, err := tx.Exec(insertQuery, level.Id, tagId)
				if err != nil {
					log.Printf("%+v", errors.WithStack(err))
					return nil, err
				}
			}
		}
	}

	return &levelEntity, nil
}
