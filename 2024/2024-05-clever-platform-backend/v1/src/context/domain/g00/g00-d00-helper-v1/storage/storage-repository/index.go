package storage

import "github.com/jmoiron/sqlx"

type Repository interface {
	BeginTx() (*sqlx.Tx, error)
	HelperCaseClearDatabaseData(tx *sqlx.Tx) error
	HelperCaseSeedAdmin(tx *sqlx.Tx) error
	HelperCaseSeedRole(tx *sqlx.Tx) error
	HelperCaseSeedPlatform(tx *sqlx.Tx) error
	HelperCaseSeedSubjectGroup(tx *sqlx.Tx) error
	HelperCaseMockQuestionDemo(tx *sqlx.Tx) error
	HelperCaseIncrementVersionId() error
	HelperCaseHealthCheck() (bool, error)
}
