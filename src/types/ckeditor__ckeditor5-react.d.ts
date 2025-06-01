declare module "@ckeditor/ckeditor5-react" {
  import * as React from "react";

  interface CKEditorProps {
    editor: any;
    data?: string;
    disabled?: boolean;
    config?: object;
    onReady?: (editor: any) => void;
    onChange?: (event: any, editor: any) => void;
    onBlur?: (event: any, editor: any) => void;
    onFocus?: (event: any, editor: any) => void;
  }

  const CKEditor: React.ComponentType<CKEditorProps>;
  export default CKEditor;
}
