import React, { useRef, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import "./upload-template.scss";

export default function UploadTemplate() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewUrl(imageUrl);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleImageClick = () => {
    // Trigger file input when image is clicked
    fileInputRef.current.click();
  };

  return (
    <div className="flex-col-center UploadTemplate">
      <h1 className="upload">Upload Template</h1>

      <div className="flex-col-center upload-cont">
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        {!previewUrl && (
          <MdCloudUpload
            className="icon-part"
            style={{ cursor: "pointer" }}
            onClick={handleImageClick}
            title="Upload File"
          />
        )}

        {previewUrl && (
          <div className="image-preview" onClick={handleImageClick}>
            <img src={previewUrl} alt="Preview" className="imgs" />
          </div>
        )}
      </div>
    </div>
  );
}
