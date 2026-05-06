package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d01-academic-standard-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	LearningAreaCreate(c constant.LearningAreaCreateRequest) error
	LearningAreaUpdate(c constant.LearningAreaUpdateRequest) error
	GetLearningArea(r constant.ListRequest, filter constant.LearningAreaFilter, pagination *helper.Pagination) ([]constant.LearningAreaResponse, int, error)
	/////////////////////////
	ContentCreate(c constant.ContentCreateRequest) error
	ContentUpdate(c constant.ContentUpdateRequest) error
	GetContent(r constant.ListRequest, filter constant.ContentFilter, pagination *helper.Pagination) ([]constant.ContentResponse, int, error)
	/////////////////////////
	CriteriaCreate(c constant.CriteriaCreateRequest) error
	CriteriaUpdate(c constant.CriteriaUpdateRequest) error
	GetCriteria(r constant.ListRequest, filter constant.CriteriaFilter, pagination *helper.Pagination) ([]constant.CriteriaResponse, int, error)
	/////////////////////////
	LearningContentCreate(c constant.LearningContentCreateRequest) error
	LearningContentUpdate(c constant.LearningContentUpdateRequest) error
	GetLearningContent(r constant.ListRequest, filter constant.LearningContentFilter, pagination *helper.Pagination) ([]constant.LearningContentResponse, int, error)
	LearningContentCsvDowload(check constant.CheckAdmin, curriculumGroupId int, StartDate string, EndDate string, filter constant.LearningContentFilter, pagination *helper.Pagination) ([]byte, error)
	LearningContentUploadCSV(req *Request, filter constant.CriteriaFilter, pagination *helper.Pagination) error
	/////////////////////////
	IndicatorsCreate(c constant.IndicatorsCreateRequest) error
	IndicatorUpdate(c constant.IndicatorsUpdateRequest) error
	GetIndicators(r constant.ListRequest, filter constant.IndicatorsFilter, pagination *helper.Pagination) ([]constant.IndicatorsResponse, int, error)
	IndicatorCsvDowload(check constant.CheckAdmin, curriculumGroupId int, StartDate string, EndDate string, filter constant.IndicatorsFilter, pagination *helper.Pagination) ([]byte, error)
	IndicatorUploadCSV(req *Request, filter constant.LearningContentFilter, pagination *helper.Pagination) error
	/////////////////////////
	SubCriteriaUpdate(c constant.SubCriteriaUpdateRequest) error
	SubCriteriaTopicCreate(c constant.SubCriteriaTopicsCreateRequest) error
	SubCriteriaTopicCsvDowload(check constant.CheckAdmin, SubcriteriaId int, StartDate string, EndDate string, filter constant.TopicsFilter, pagination *helper.Pagination) ([]byte, error)
	ReportCsvDowload(check constant.CheckAdmin, SubcriteriaId int, StartDate string, EndDate string, pagination *helper.Pagination) ([]byte, error)
	SubCriteriaTopicUploadCSV(req *RequestSCT, pagination *helper.Pagination) error

	LearningAreaGet(in *LearningAreaGetInput) (*LearningAreaGetOutput, error)
	ContentGet(in *ContentGetInput) (*ContentGetOutput, error)
	CriteriaGet(in *CriteriaGetInput) (*CriteriaGetOutput, error)
	LearningContentGet(in *LearningContentGetInput) (*LearningContentGetOutput, error)
	IndicatorGet(in *IndicatorGetInput) (*IndicatorGetOutput, error)
	YearCaseListByCurriculumGroup(in *YearCaseListByCurriculumGroupIdInput) (*YearCaseListByCurriculumGroupIdOutput, error)

	SubCriteriaTopicGet(in *SubCriteriaTopicGetInput) (*SubCriteriaTopicGetOutput, error)
	SubCriteriaCaseListByCurriculumGroupId(in *SubCriteriaCaseListByCurriculumGroupIdInput) (*SubCriteriaCaseListByCurriculumGroupIdOutput, error)
	SubCriteriaTopicUpdate(c constant.SubCriteriaTopicsUpdateRequest) error

	LearningAreaCaseBulkEdit(in *LearningAreaCaseBulkEditInput) error
	ContentCaseBulkEdit(in *ContentCaseBulkEditInput) error
	CriteriaCaseBulkEdit(in *CriteriaCaseBulkEditInput) error
	LearningContentCaseBulkEdit(in *LearningContentCaseBulkEditInput) error
	IndicatorCaseBulkEdit(in *IndicatorCaseBulkEditInput) error
	SubCriteriaTopicCaseBulkEdit(in *SubCriteriaTopicCaseBulkEditInput) error

	//csv
	LearningAreaDownloadCSV(req *DownloadLearningAreaCSVRequest, filter constant.LearningAreaFilter) ([]byte, error)
	LearningAreaUploadCSV(req *UploadLearningAreaCSVRequest) error
	ContentUploadCSV(req *UploadContentCSVRequest, filter constant.LearningAreaFilter) error
	ContentDownloadCSV(req *DownloadContentCSVRequest, filter constant.ContentFilter) ([]byte, error)
	CriteriaDownloadCSV(req *DownloadCriteriaCSVRequest, filter constant.CriteriaFilter) ([]byte, error)
	CriteriaUploadCSV(req *UploadCriteriaCSVRequest, filter constant.ContentFilter) error
	GetTopic(SubcriteriaId int, r constant.ListRequest, filter constant.TopicsFilter, pagination *helper.Pagination) ([]constant.TopicResponse, int, error)
	GetReport(SubcriteriaId int, r constant.ListRequest, pagination *helper.Pagination) ([]constant.ReportResponse, int, error)
}
