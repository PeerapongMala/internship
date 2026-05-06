import { create } from 'zustand';

interface UploadPostState {
  date: Date;
  setDate: (input: Date) => void;
  filesName: string[];
  setFilesName: (input: string) => void;
  file: File[];
  urlFile: string[];
  addFile: (input: File[]) => void;
  clearState: () => void;
}

export const useFileStore = create<UploadPostState>()((set) => ({
  date: new Date(new Date().setDate(new Date().getDate() + 1)) ,
  setDate(input) {
    set(() => ({ date: input }));
  },
  filesName: [],
  setFilesName(input) {
    set((state) => ({ filesName: [...state.filesName, input] }));
  },
  file: [],
  urlFile: [],
  addFile(input) {
    // const urlFiles = input.map((item) => URL.createObjectURL(item));
    set((state) => ({
      file: [...state.file, ...input],
      //   urlFile: [...state.urlFile, ...urlFiles],
    }));
  },
  clearState() {
    set(() => ({ date: new Date(), file: [] }));
  },
}));

export const renderDate = (
  date: Date | null,
  format: 'dd/mm/yyyy' | 'yyyy-mm-dd',
): string => {
  if (date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    if (format === 'dd/mm/yyyy') {
      const formattedDate = `${day}/${month}/${year}`;
      return formattedDate;
    } else {
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    }
  } else {
    return 'วว/ดด/ปปปป';
  }
};
