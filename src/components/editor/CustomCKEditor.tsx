"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Base64UploadAdapter from "./Base64UploadAdapter";

// Import WrappedCKEditor secara dynamic tanpa SSR
const WrappedCKEditor = dynamic(() => import("./WrappedCKEditor"), { ssr: false });

const useClassicEditor = () => {
    const [ClassicEditor, setClassicEditor] = useState<any>(null);

    useEffect(() => {
        import("@ckeditor/ckeditor5-build-classic").then((mod) => {
            setClassicEditor(mod.default);
        });
    }, []);

    return ClassicEditor;
};

interface CustomCKEditorProps {
    value: string;
    onChange: (data: string) => void;
}

const CustomCKEditor: React.FC<CustomCKEditorProps> = ({ value, onChange }) => {
    const ClassicEditor = useClassicEditor();

    if (!ClassicEditor) return <div>Loading editor...</div>;

    return (
        <WrappedCKEditor
            editor={ClassicEditor}
            data={value}
            onReady={(editor: any) => {
                editor.plugins.get("FileRepository").createUploadAdapter = (loader: any) =>
                    new Base64UploadAdapter(loader);
            }}
            onChange={(_: any, editor: any) => {
                const data = editor.getData();
                onChange(data);
            }}
        />
    );
};

export default CustomCKEditor;
