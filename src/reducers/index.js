import { combineReducers } from 'redux';

import ActiveFile from './reducer_active_file';
import OfflineMode from './reducer_offline_mode';
import Files from './reducer_files';
import ShowDiffModal from './reducer_diff_modal';
import ShowOpenModal from './reducer_open_modal';
import ShowSaveModal from './reducer_save_modal';
import ProjectName from './reducer_project_name';

const rootReducer = combineReducers({
  //state: (state = {}) => state
  activeFile: ActiveFile,
  files: Files,
  offlineMode: OfflineMode,
  showDiffModal:  ShowDiffModal,
  showOpenModal: ShowOpenModal,
  showSaveModal: ShowSaveModal,
  projectName: ProjectName
});

export default rootReducer;
