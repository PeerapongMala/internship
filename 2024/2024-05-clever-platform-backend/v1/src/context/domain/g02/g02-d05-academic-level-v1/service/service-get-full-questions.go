package service

import (
	"sync"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
)

type GetFullQuestionsInput struct {
	Questions []constant.QuestionEntity
}

type GetFullQuestionsOutput struct {
	FullQuestions []interface{}
}

func (service *serviceStruct) GetFullQuestions(in *GetFullQuestionsInput) (*GetFullQuestionsOutput, error) {
	fullQuestions := make([]interface{}, len(in.Questions))
	var wg sync.WaitGroup
	wg.Add(len(in.Questions))

	var mu sync.Mutex

	errChan := make(chan error, len(in.Questions))

	for i := range in.Questions {
		go func(idx int) {
			defer wg.Done()

			question := in.Questions[idx]

			var result interface{}
			var err error

			switch question.QuestionType {
			case constant.MultipleChoice:
				output, e := service.GetFullQuestionMultipleChoice(&GetFullQuestionMultipleChoiceInput{Question: question})
				result, err = output.FullQuestionMultipleChoice, e
			case constant.Sort:
				output, e := service.GetFullQuestionSort(&GetFullQuestionSortInput{Question: question})
				result, err = output.FullQuestionSort, e
			case constant.Group:
				output, e := service.GetFullQuestionGroup(&GetFullQuestionGroupInput{Question: question})
				result, err = output.FullQuestionGroup, e
			case constant.Placeholder:
				output, e := service.GetFullQuestionPlaceholder(&GetFullQuestionPlaceholderInput{Question: question})
				result, err = output.FullQuestionPlaceholder, e
			case constant.Input:
				output, e := service.GetFullQuestionInput(&GetFullQuestionInputInput{Question: question})
				result, err = output.FullQuestionInput, e
			case constant.Learn:
				output, e := service.GetFullQuestionLearn(&GetFullQuestionLearnInput{Question: question})
				result, err = output.FullQuestionLearn, e
			}

			if err != nil {
				errChan <- err
				return
			}

			mu.Lock()
			fullQuestions[idx] = result
			//fullQuestions = append(fullQuestions, result)
			mu.Unlock()
		}(i)
	}

	go func() {
		wg.Wait()
		close(errChan)
	}()

	for err := range errChan {
		if err != nil {
			return nil, err
		}
	}

	return &GetFullQuestionsOutput{
		fullQuestions,
	}, nil
}
