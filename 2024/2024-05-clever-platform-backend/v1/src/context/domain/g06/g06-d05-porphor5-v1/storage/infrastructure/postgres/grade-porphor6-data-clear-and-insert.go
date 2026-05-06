package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d05-porphor5-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) Porphor6DataClearAndInsert(tx *sqlx.Tx, entities []*constant.Porphor6DataEntity) (err error) {
	if len(entities) == 0 {
		return nil
	}

	_, err = tx.Exec(`DELETE FROM grade.porphor6_data WHERE form_id = $1`, entities[0].FormID)
	if err != nil {
		return errors.Wrap(err, "failed to delete old grade data")
	}

	for _, entity := range entities {
		_, err = tx.Exec(
			`
		INSERT INTO grade.porphor6_data (
			form_id,
			"order",
			student_id,
			data_json,
			created_at
		)
		VALUES ($1, $2, $3, $4, NOW());
	`,
			entity.FormID,
			entity.Order,
			entity.StudentID,
			entity.DataJson,
		)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return errors.Wrap(err, "failed to insert new grade data")
		}
	}

	return nil
}
