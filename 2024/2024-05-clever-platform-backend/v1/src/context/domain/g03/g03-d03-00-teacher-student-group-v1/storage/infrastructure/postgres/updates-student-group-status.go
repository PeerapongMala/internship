package postgres

import (
	"fmt"
	"strings"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-00-teacher-student-group-v1/constant"
)

func (postgresRepository *postgresRepository) UpdatesStudentGroupStatus(teacherId string, updateBy string, items []constant.UpdateStudyGroupsStatusItem) error {
	if len(items) == 0 {
		return nil
	}

	tx, err := postgresRepository.Database.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	createTempTableQuery := `
		CREATE TEMP TABLE temp_items (id INT4, status VARCHAR) ON COMMIT DROP;
	`
	_, err = tx.Exec(createTempTableQuery)
	if err != nil {
		return fmt.Errorf("failed to create temp table: %w", err)
	}

	var valuePlaceholders []string
	var values []interface{}
	for i, item := range items {
		pos := i * 2
		valuePlaceholders = append(valuePlaceholders, fmt.Sprintf("($%d, $%d)", pos+1, pos+2))
		values = append(values, item.ID, item.Status)
	}

	insertQuery := fmt.Sprintf("INSERT INTO temp_items (id, status) VALUES %s;", strings.Join(valuePlaceholders, ","))
	_, err = tx.Exec(insertQuery, values...)
	if err != nil {
		return fmt.Errorf("failed to insert into temp table: %w", err)
	}

	updateQuery := `
		UPDATE class.study_group sg
		SET status = ti.status,
			updated_by = $2,
			updated_at = $3
		FROM temp_items ti,
			class.class c,
			school.class_teacher ct
		WHERE sg.id = ti.id
		AND c.id = sg.class_id
		AND ct.class_id = c.id
		AND ct.teacher_id = $1;
	`

	data, err := tx.Exec(updateQuery, teacherId, updateBy, time.Now())
	if err != nil {
		return fmt.Errorf("failed to update study_group: %w", err)
	}

	fmt.Println(data)
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
