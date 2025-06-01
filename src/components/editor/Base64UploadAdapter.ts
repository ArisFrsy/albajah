export default class Base64UploadAdapter {
  private loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then((file: File) => {
        if (!file) {
          throw new Error("No file provided.");
        }
        if (file.size > 300 * 1024) {
          throw new Error("File size exceeds the limit of 300KB.");
        }
        return this.convertFileToBase64(file);
      })
      .then((base64: string) => ({ default: base64 }));
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}
