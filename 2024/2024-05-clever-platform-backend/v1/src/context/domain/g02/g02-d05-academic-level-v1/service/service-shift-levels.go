package service

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jinzhu/copier"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

// ==================== Service ==========================

type ShiftLevelsInput struct {
	Tx          *sqlx.Tx
	SubLessonId int
	Index       int
}

func (service *serviceStruct) ShiftLevel(in *ShiftLevelsInput) error {
	levels, err := service.academicLevelStorage.LevelCaseGetLevelToShift(in.Tx, in.SubLessonId, in.Index)
	if err != nil && err != sql.ErrNoRows {
		return err
	}

	for _, level := range levels {
		levelUpdateEntity := constant.LevelUpdateEntity{}
		err = copier.Copy(&levelUpdateEntity, level)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
		levelUpdateEntity.Index--
		_, err := service.academicLevelStorage.LevelUpdate(in.Tx, &levelUpdateEntity)
		if err != nil {
			return err
		}
	}

	return nil
}
