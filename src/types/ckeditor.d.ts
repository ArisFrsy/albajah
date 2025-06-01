// src/types/ckeditor.d.ts
declare module "@ckeditor/ckeditor5-react" {
  import * as React from "react";
  import { Editor } from "@ckeditor/ckeditor5-core";

  interface CKEditorProps {
    editor: any;
    data?: string;
    onReady?: (editor: Editor) => void;
    onChange?: (event: any, editor: Editor) => void;
    onBlur?: (event: any, editor: Editor) => void;
    onFocus?: (event: any, editor: Editor) => void;
    config?: Record<string, any>;
  }

  export class CKEditor extends React.Component<CKEditorProps> {}
}
