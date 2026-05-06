import { TEvaluationForm } from '@domain/g06/g06-d02/local/types/grade';
import { createSelector } from 'reselect';
import { create } from 'zustand';

interface Phorpor6BreadcrumInfoState {
  // State
  evaluationForm?: TEvaluationForm;

  // Action
  setEvaluationForm(data: TEvaluationForm): void;
}

export const usePhorpor6BreadcrumInfoStore = create<Phorpor6BreadcrumInfoState>(
  (set, get) => ({
    evaluationForm: undefined,
    setEvaluationForm(data) {
      set({ evaluationForm: data });
    },
  }),
);

const getEvaluationForm = (state: Phorpor6BreadcrumInfoState) => state.evaluationForm;

export const phorpor6BreadcrumInfoSelectors = {
  getEvaluationForm,

  getBreadcrumInfo: createSelector([getEvaluationForm], (evaluationForm) => {
    if (!evaluationForm) return null;
    return {
      gradeLevel: evaluationForm.year,
      academicYear: evaluationForm.academic_year,
      room: evaluationForm.school_room,
      term: evaluationForm.school_term,
    };
  }),
};
