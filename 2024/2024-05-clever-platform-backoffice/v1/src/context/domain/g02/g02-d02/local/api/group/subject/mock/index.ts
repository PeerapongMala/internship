// import { ICreateSubject, IDownloadCsvFilter, ISubject } from "@domain/g02/g02-d02/local/type";
// import { PaginationAPIResponse, BasePaginationAPIQueryParams, FailedAPIResponse, DataAPIResponse } from "@global/utils/apiResponseHelper";
// import { SubjectRepository } from "@domain/g02/g02-d02/local/api/repository/subject";

// import GetAllMockJson from './get-all/index.json'
// import CreateMockJson from './create/index.json'
// import GetByIdMockJson from './get-by-id/index.json'

// const SubjectMock: SubjectRepository = {
//   GetAll: (subjectGroupId: number, curriculumGroupId: number, yearId: number, query: BasePaginationAPIQueryParams): Promise<PaginationAPIResponse<ISubject> | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve(GetAllMockJson as PaginationAPIResponse<ISubject>);
//     })
//   },
//   Create: (data: ICreateSubject): Promise<DataAPIResponse<ISubject[]> | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve(CreateMockJson as DataAPIResponse<ISubject[]>);
//     })
//   },
//   Update: (data: ICreateSubject): Promise<DataAPIResponse<ISubject[]> | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve(CreateMockJson as DataAPIResponse<ISubject[]>);
//     })
//   },
//   GetById: (id: number): Promise<DataAPIResponse<ISubject[]>> => {
//     return new Promise((resolve) => {
//       resolve(GetByIdMockJson as DataAPIResponse<ISubject[]>);
//     })
//   },
//   DownloadCsv: (filter: IDownloadCsvFilter): Promise<void | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve();
//     })
//   },
//   UploadCsv: (file: File | null, curriculumGroupId: number): Promise<DataAPIResponse<ISubject[] | FailedAPIResponse>> => {
//     return new Promise((resolve) => {
//       resolve(CreateMockJson as DataAPIResponse<ISubject[]>);
//     })
//   }
// }

// export default SubjectMock;
