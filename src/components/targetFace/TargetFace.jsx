import React, { useState, useRef } from "react";
import "./target-face.scss";

import { reduceImageSize } from "../../utils/reduceImageSize";
import { resizeImageDimensions } from "../../utils/resizeImageDimensions";
import useCropFace from "../../customHooks/useCropFace";

import targetFaceImg from "./../../assets/target-face/face.jpeg";
import arrowImg from "./../../assets/target-face/arrow.webp";
import uploadImg from "./../../assets/target-face/upload.jpeg";

export default function TargetFace() {
  const uploadFaceRef = useRef(null);
  const [croppedUserFaces, setCroppedUserFaces] = useState(null);
  const [selectedFace, setSelectedFace] = useState(null);

  // handle select face
  const handleSelectFace = (face) => {
    setCroppedUserFaces(null);
    setSelectedFace(face);
    console.log(face);
  };

  // upload template and user image from user's file
  const handleUploadImg = async (e, isTemplate) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        let imageFile = file;
        const reader = new FileReader();
        reader.onloadend = async (event) => {
          const img = new window.Image();
          img.src = event.target.result;
          img.onload = async () => {
            try {
              const resizedFile = await resizeImageDimensions(imageFile);
              const finalFile = await reduceImageSize(
                resizedFile,
                imageFile.size
              );
              const finalReader = new FileReader();
              finalReader.onloadend = async () => {
                try {
                  const { faces, metaData } = await useCropFace(
                    finalReader.result
                  );
                  console.log(faces, metaData);

                  setCroppedUserFaces({ faces, metaData });
                } catch (error) {
                  console.log(error);
                }
              };
              finalReader.readAsDataURL(finalFile);
            } catch (error) {
              console.error("Error processing image:", error);
            }
          };
        };
        reader.readAsDataURL(imageFile);
      } else {
        e.target.value = null;
        alert("Please select an image file.");
      }
    }
  };

  console.log(croppedUserFaces);

  return (
    <div className="TargetFace vh-100 flex-row-center">
      <div className="mainContainer flex-col-center justify-content-start w-25 h-50 gap-5 overflow-y-scroll border-1 p-2">
        <div className="singleContainer flex-row-center gap-5 w-100 border-1">
          <img
            src={targetFaceImg}
            alt="target-face"
            className="targetFace rounded-circle"
          />
          <img src={arrowImg} alt="arrow" className="arrow" />
          <img
            onClick={() => uploadFaceRef.current.click()}
            src={
              selectedFace
                ? `data:image/jpeg;base64,${selectedFace}`
                : uploadImg
            }
            alt="upload-face"
            className="uploadFace rounded-circle"
          />
          <input
            type="file"
            ref={uploadFaceRef}
            onChange={(e) => handleUploadImg(e)}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* select user face */}
      {croppedUserFaces?.faces?.length > 0 && (
        <div className="croppedFacesContainer flex-row-center w-25 h-25 gap-2">
          {croppedUserFaces?.faces?.map((face, index) => (
            <img
              onClick={() => handleSelectFace(face)}
              key={index}
              src={`data:image/jpeg;base64,${face}`}
              alt="user-face"
              className="userFace rounded-circle"
            />
          ))}
        </div>
      )}
    </div>
  );
}
