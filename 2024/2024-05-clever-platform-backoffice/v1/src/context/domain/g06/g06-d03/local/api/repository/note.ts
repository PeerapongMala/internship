import { DataAPIResponse } from '@global/utils/apiResponseHelper';
import { IAddNoteRequest, IGetNote } from '../../type';

export interface NoteRepository {
  AddNote: (data: IAddNoteRequest) => Promise<DataAPIResponse<null>>;
  GetNote: (evaluationSheetId: number) => Promise<DataAPIResponse<IGetNote[]>>;
}
