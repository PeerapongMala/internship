package postgres

import (
	"fmt"
	"github.com/jmoiron/sqlx"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
)

func (postgresRepository *postgresRepository) CreateSubjectLesson(tx *sqlx.Tx, request *constant.SubjectLessonCreateRequest) (*constant.SubjectLessonResponse, error) {
	response := constant.SubjectLessonResponse{}
	var latestIndex int
	indexQuery := `
		SELECT COALESCE(MAX(index), 0)
		FROM "subject"."lesson"
		WHERE subject_id = $1
	`
	err := tx.Get(
		&latestIndex,
		indexQuery,
		request.SubjectId,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get latest index: %w", err)
	}

	// Increment the latest index
	newIndex := latestIndex + 1

	query := `
		INSERT INTO "subject"."lesson"
		(
			subject_id,
			index,
			name,
			font_name,
			font_size,
			background_image_path,
			status,
			created_at,
			created_by,
			admin_login_as,
			wizard_index
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
			$10,
			$11
		)
		RETURNING *
		`
	err = tx.Get(
		&response,
		query,
		request.SubjectId,
		newIndex, // Use the new index
		request.Name,
		request.FontName,
		request.FontSize,
		request.BackgroundImagePath,
		request.Status,
		request.CreatedAt,
		request.CreatedBy,
		request.AdminLoginAs,
		request.WizardIndex,
	)
	// log.Println("query", query)
	// log.Println("response", response)
	// log.Println("err", err)
	if err != nil {
		return nil, err
	}

	return &response, nil

}
