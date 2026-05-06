import SubmitOnMultipleChoices from './form-multiple-choices';
import SubmitOnPairing from './form-pairing';
import SubmitOnSorting from './form-sorting';
import SubmitOnPlaceholder from './form-placeholder';
import SubmitOnFormInput from './form-input';
import loadGameConfig from './load-config';

function calculateStars(score: number, maxScore: number) {
  return Math.min(Math.floor((score / maxScore) * 3), 3);
}

export {
  SubmitOnMultipleChoices,
  SubmitOnPairing,
  SubmitOnSorting,
  SubmitOnPlaceholder,
  SubmitOnFormInput,
  loadGameConfig,
  calculateStars,
};
