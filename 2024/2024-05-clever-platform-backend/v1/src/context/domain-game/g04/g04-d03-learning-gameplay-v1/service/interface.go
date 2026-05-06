package service

type ServiceInterface interface {
	QuizSubmitResult(in *quizSubmitResultInput) error
}
