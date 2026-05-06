package constant

type TTestPairModelStat struct {
	Index            int    `json:"index"`
	StudentFullname  string `json:"student_fullname"`
	StudentFirstName string `json:"student_first_name"`
	StudentLastName  string `json:"student_last_name"`
	PreTestScore     int    `json:"pre_test_score"`
	PostTestScore    int    `json:"post_test_score"`
}

type TestStat struct {
	PretestScore  *float64 `json:"pre_test_score"`
	PostTestScore *float64 `json:"post_test_score"`
}

type QuestionStatByStudent struct {
	QuestionIndex         int     `json:"question_index"`
	One                   int     `json:"one"`
	Sum                   int     `json:"sum"`
	GreateGroup           int     `json:"greate_group"`
	WeakGroup             int     `json:"weak_group"`
	Difficulty            *int    `json:"difficulty"`
	DifficultyDescription *string `json:"difficulty_description"`
	Reliability           *int    `json:"reliability"`
}

type QuestionScoreStat struct {
	QuestionIndex int `json:"question_index"`
	Score         int `json:"score"`
}

type QuestionCalStatScore struct {
	QuestionIndex int     `json:"question_index"`
	Score         float64 `json:"score"`
}

type StudentQuestionStat struct {
	StudentID        string                        `json:"student_id"`
	StudentTitle     string                        `json:"student_title"`
	StudentFirstName string                        `json:"student_first_name"`
	StudentLastName  string                        `json:"student_last_name"`
	QuestionData     []QuestionByStudentStatEntity `json:"question_data"`
	ScoreSum         int                           `json:"score_sum"`
}

type SumQuestionStat struct {
	QuestionData []QuestionScoreStat `json:"question_data"`
	XSum         int                 `json:"x"`
	PowXSum      int                 `json:"pow_x_sum"`
}
