/**
 * All reducers are imported and combined to create application state 
 */

import { combineReducers } from 'redux';

import ActiveFile                   from './reducer_active_file';
import ActiveLine                   from './reducer_active_line';
import AvailableEditorOptions       from './reducer_available_editor_options';
import CursorPosition               from './reducer_cursor_position';
import EditorSettings               from './reducer_editor_settings';
import EditorStreaming              from './reducer_editor_stream';
import Files                        from './reducer_files';
import OfflineMode                  from './reducer_offline_mode';
import ProjectId                    from './reducer_project_id';
import ProjectName                  from './reducer_project_name';
import ShowDiffModal                from './reducer_diff_modal';
import ShowGutter                   from './reducer_show_gutter';
import ShowOpenModal                from './reducer_open_modal';
import ShowOpenServerProjectsModal  from './reducer_open_server_projects_modal';
import ShowSaveModal                from './reducer_save_modal';

/**
 * these are available to react components if they 'connect' to Redux
 */
const rootReducer = combineReducers({
  activeFile: ActiveFile,
  activeLine: ActiveLine,
  availableEditorOptions: AvailableEditorOptions,
  cursorPos: CursorPosition,
  editorSettings: EditorSettings,
  editorStreaming: EditorStreaming,
  files: Files,
  offlineMode: OfflineMode,
  projectId: ProjectId,
  projectName: ProjectName,
  showDiffModal:  ShowDiffModal,
  showOpenModal: ShowOpenModal,
  showOpenServerProjectsModal: ShowOpenServerProjectsModal,
  showGutter: ShowGutter,
  showSaveModal: ShowSaveModal
});

export default rootReducer;
