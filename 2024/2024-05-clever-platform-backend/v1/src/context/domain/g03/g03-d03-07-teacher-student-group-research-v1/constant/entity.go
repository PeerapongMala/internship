package constant

type TTestPairModelStatEntity struct {
	StudentFullname  string `db:"student_fullname"`
	PreTestScore     *int   `db:"pre_test_score"`
	PostTestScore    *int   `db:"post_test_score"`
	StudentFirstname string `db:"student_first_name" json:"student_firstname"`
	StudentLastname  string `db:"student_last_name" json:"student_lastname"`
}

type StudentQuestionStatEntity struct {
	StudentID        string                        `db:"student_id" json:"student_id"`
	StudentTitle     string                        `db:"student_title" json:"student_title"`
	StudentFirstname string                        `db:"student_firstname" json:"student_firstname"`
	StudentLastname  string                        `db:"student_lastname" json:"student_lastname"`
	Questions        []QuestionByStudentStatEntity `db:"questions" json:"questions"`
	ScoreSum         int                           `db:"score_sum" json:"score_sum"`
}

type QuestionByStudentStatEntity struct {
	QuestionIndex int  `db:"question_index" json:"question_index"`
	Score         *int `db:"score" json:"score,omitempty"`
}

type PrePostTestStudentByStudentStatEntity struct {
	StudentId string `db:"student_id" json:"student_id"`
	Score     *int   `db:"score" json:"score,omitempty"`
}

type LevelParamsEntity struct {
	ID           int     `db:"id" json:"id"`
	Index        *int    `db:"index" json:"index"`
	QuestionType *string `db:"question_type" json:"question_type"`
	LevelType    *string `db:"level_type" json:"level_type"`
	Status       *string `db:"status" json:"status"`
}
