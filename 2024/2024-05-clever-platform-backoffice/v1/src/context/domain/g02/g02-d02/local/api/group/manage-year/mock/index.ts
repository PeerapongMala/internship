// import {
//   IAddManageYear,
//   IDownloadCsvFilter,
//   IManageYear,
//   IUpdateManageYear,
// } from '@domain/g02/g02-d02/local/type';
// import {
//   PaginationAPIResponse,
//   BasePaginationAPIQueryParams,
//   FailedAPIResponse,
//   DataAPIResponse,
//   DataAPIRequest,
// } from '@global/utils/apiResponseHelper';
// import { ManageYearRepository } from '@domain/g02/g02-d02/local/api/repository/manage-year';

// import GetAllMock from './get-all/index.json';
// import AddMock from './add/index.json';
// import GetByIdMock from './get-by-id/index.json';

// const ManageYearMock: ManageYearRepository = {
//   GetAll: (
//     platformId: number,
//     query: BasePaginationAPIQueryParams,
//   ): Promise<PaginationAPIResponse<IManageYear> | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve(GetAllMock as PaginationAPIResponse<IManageYear>);
//     });
//   },
//   GetById: (yearId: number): Promise<DataAPIResponse<IManageYear>> => {
//     return new Promise((resolve) => {
//       resolve(GetByIdMock as DataAPIResponse<IManageYear>);
//     });
//   },
//   Create: (data: DataAPIRequest<IManageYear>): Promise<DataAPIResponse<IManageYear>> => {
//     return new Promise((resolve) => {
//       resolve(AddMock as DataAPIResponse<IManageYear>);
//     });
//   },
//   Update: (
//     id: number,
//     data: DataAPIRequest<IManageYear>,
//   ): Promise<DataAPIResponse<IManageYear>> => {
//     return new Promise((resolve) => {
//       resolve(AddMock as DataAPIResponse<IManageYear>);
//     });
//   },
//   DownloadCsv: (
//     platformId: number,
//     filter: IDownloadCsvFilter,
//   ): Promise<void | FailedAPIResponse> => {
//     return new Promise((resolve) => {
//       resolve();
//     });
//   },
//   UploadCsv: (
//     platformId: number,
//     file: File | null,
//   ): Promise<DataAPIResponse<IManageYear[]>> => {
//     return new Promise((resolve) => {
//       resolve(AddMock as DataAPIResponse<IManageYear[]>);
//     });
//   },
//   BulkEdit: (
//     years: Pick<IManageYear, 'id' | 'status'>[],
//     admin_login_as?: IManageYear['admin_login_as'],
//   ): Promise<DataAPIResponse<undefined[]>> => {
//     return new Promise((resolve) => {
//       resolve();
//     });
//   },
// };

// export default ManageYearMock;
