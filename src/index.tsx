import QuillEditor from './editor/quill-editor';
import { QuillToolbar } from './toolbar/quill-toolbar';
import QuillIcons from './constants/icons';
import type {
  EditorEventHandler,
  SelectionChangeData,
  EditorChangeData,
  TextChangeData,
  FormatChangeData,
  HtmlChangeData,
} from './constants/editor-event';
export default QuillEditor;
export { QuillToolbar, QuillIcons };
export type {
  EditorEventHandler,
  SelectionChangeData,
  EditorChangeData,
  TextChangeData,
  FormatChangeData,
  HtmlChangeData,
};
