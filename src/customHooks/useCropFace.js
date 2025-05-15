import axios from "axios";

export default async function useCropFace(base64Img) {
  if (base64Img) {
    try {
      const response = await axios.post("https://52.56.108.15/cropsingle", {
        image: base64Img.split(",")[1],
      });

      console.log(response, "response from server crop");

      if (response?.data?.first?.length === 0) {
        throw new Error("no face detected");
      } else {
        return {
          faces: response?.data?.first,
          metaData: response?.data?.second,
        };
      }
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error("no image provided in useCropFace");
  }
}
