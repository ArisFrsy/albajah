// components/editor/WrappedCKEditor.tsx
"use client";

import React from "react";
import CKEditor from "@ckeditor/ckeditor5-react";

interface WrappedCKEditorProps {
    editor: any;
    data: string;
    onReady: (editor: any) => void;
    onChange: (event: any, editor: any) => void;
}

const WrappedCKEditor: React.FC<WrappedCKEditorProps> = (props) => {
    return <CKEditor {...props} />;
};

export default WrappedCKEditor;
