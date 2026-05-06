package postgres

import (
	"github.com/jmoiron/sqlx"
	"log"
	"time"
)

func (postgresRepository *postgresRepository) UpdateTeacherRewardTransaction(tx *sqlx.Tx, itemId int, studentId string) error {
	query := `
		UPDATE "teacher_item"."teacher_reward_transaction" trt
		SET
			"updated_at" = $1
		WHERE
		    trt.item_id = $2
			AND trt.student_id = $3	
	`
	_, err := tx.Exec(query, time.Now().UTC(), itemId, studentId)
	if err != nil {
		log.Printf("%+v", err)
		return err
	}

	return nil
}
