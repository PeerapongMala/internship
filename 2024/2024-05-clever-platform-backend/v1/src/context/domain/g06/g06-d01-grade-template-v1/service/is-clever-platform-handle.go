package service

import (
	"github.com/jmoiron/sqlx"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
)

func IsCleverDumpData(tx *sqlx.Tx, learningArea constant.SubjectEntity) error {
	//TODO: Dump data from clever platform It's will auto complete learning area
	return nil
}