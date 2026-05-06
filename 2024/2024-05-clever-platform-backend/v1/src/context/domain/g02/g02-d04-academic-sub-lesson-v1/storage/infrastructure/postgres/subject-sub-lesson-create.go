package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
)

func (postgresRepository *postgresRepository) CreateSubjectSubLesson(tx *sqlx.Tx, request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error) {
	// log.Println("request", request)
	response := constant.SubjectSubLessonResponse{}

	var latestIndex int
	indexQuery := `
		SELECT COALESCE(MAX(index), 0)
		FROM "subject"."sub_lesson"
		WHERE lesson_id = $1
	`
	err := tx.Get(
		&latestIndex,
		indexQuery,
		request.LessonId,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest index: %w", err)
	}

	// Increment the latest index
	newIndex := latestIndex + 1

	query := `
		INSERT INTO "subject"."sub_lesson" 
		(
			lesson_id,
			indicator_id,
			name,
			status,
			created_at,
			created_by,
			updated_at,
			updated_by,
			admin_login_as,
			index
			) 
		VALUES 
		(
			$1,
			$2,
			$3,
			$4,
			$5,
			$6,
			$7,
			$8,
			$9,
			$10
		) 
		RETURNING *
		`
	err = tx.Get(
		&response,
		query,
		request.LessonId,
		request.IndicatorId,
		request.Name,
		request.Status,
		request.CreatedAt,
		request.CreatedBy,
		request.UpdatedAt,
		request.UpdatedBy,
		request.AdminLoginAs,
		newIndex)
	// log.Println("response", response)
	// log.Println("err", err)
	if err != nil {
		return nil, err
	}
	return &response, nil

}
