import { combineReducers } from 'redux';

import ActiveFile from './reducer_active_file';
import ActiveLine from './reducer_active_line';
import AvailableEditorOptions from './reducer_available_editor_options';
import CursorPosition from './reducer_cursor_position';
import EditorSettings from './reducer_editor_settings';
import Files from './reducer_files';
import OfflineMode from './reducer_offline_mode';
import ShowDiffModal from './reducer_diff_modal';
import ShowOpenModal from './reducer_open_modal';
import ShowSaveModal from './reducer_save_modal';
import ProjectName from './reducer_project_name';

const rootReducer = combineReducers({
  //state: (state = {}) => state
  activeFile: ActiveFile,
  activeLine: ActiveLine,
  availableEditorOptions: AvailableEditorOptions,
  cursorPos: CursorPosition,
  editorSettings: EditorSettings,
  files: Files,
  offlineMode: OfflineMode,
  projectName: ProjectName,
  showDiffModal:  ShowDiffModal,
  showOpenModal: ShowOpenModal,
  showSaveModal: ShowSaveModal
});

export default rootReducer;
