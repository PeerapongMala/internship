// import { ICreateSubjectGroup, IDownloadCsvFilter, ISubjectGroup, IUpdateSubjectGroup } from "@domain/g02/g02-d02/local/type";
// import { PaginationAPIResponse, BasePaginationAPIQueryParams, FailedAPIResponse, DataAPIResponse } from "@global/utils/apiResponseHelper";
// import { SubjectGroupRepository } from "@domain/g02/g02-d02/local/api/repository/subject-group";

// import GetAllMockJson from './get-all/index.json'
// import CreateMockJson from './create/index.json'
// import UpdateMockJson from './update/index.json'

// const SubjectGroupMock: SubjectGroupRepository = {
//   GetAll: (yearId: number, query: BasePaginationAPIQueryParams): Promise<PaginationAPIResponse<ISubjectGroup> | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve(GetAllMockJson as PaginationAPIResponse<ISubjectGroup>);
//     })
//   },
//   Create: (data: ICreateSubjectGroup): Promise<DataAPIResponse<ISubjectGroup> | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve(CreateMockJson as DataAPIResponse<ISubjectGroup>);
//     })
//   },
//   Update: (data: IUpdateSubjectGroup): Promise<DataAPIResponse<ISubjectGroup> | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve(UpdateMockJson as DataAPIResponse<ISubjectGroup>);
//     })
//   },
//   DownloadCsv: (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve();
//     })
//   },
//   UploadCsv: (file: File | null, curriculumGroupId: number): Promise<DataAPIResponse<ISubjectGroup[] | FailedAPIResponse>> => {
//     return new Promise((resolve) => {
//       resolve(CreateMockJson as DataAPIResponse<ISubjectGroup[]>);
//     })
//   },
// }

// export default SubjectGroupMock;
