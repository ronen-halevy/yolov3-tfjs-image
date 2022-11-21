import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

import LoadModel from "./LoadModel.js";
import Inference from "./inference.js";
import Draw from "./draw.js";

tf.setBackend("webgl");

export const Detection = () => {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  const [imageUrl, setImageUrl] = useState(null);

  let canvas = canvasRef.current;
  console.log("pre");
  //  let model = LoadModel();
  console.log("post");

  function fileToDataUri(field) {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        resolve(reader.result);
      });

      reader.readAsDataURL(field);
    });
  }

  const imgFilehandler = async (e) => {
    // if (e.target.files.length !== 0) {
    console.log("fetchData0");
    let model = await LoadModel();
    console.log("model", model);
    const image = new window.Image();
    image.src = await fileToDataUri(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
    image.addEventListener("load", async () => {
      const imgTensor = tf.browser.fromPixels(image);
      let canvas = canvasRef.current;

      let context = canvas.getContext("2d");

      var inference = new Inference(model, canvasRef, context);

      let [bboxes, scores, classIndices] = await inference.runInference(
        imgTensor
      );
      var draw = new Draw(canvas);

      await draw.drawOnImage(image, bboxes, scores, classIndices);
    });
  };

  return (
    <div>
      {/* <button onClick={() => takePhoto()}>Take a photo</button> */}
      {/* <video ref={videoRef} /> */}
      <input type="file" onChange={imgFilehandler} accept="image/*" />

      <canvas className="size" ref={canvasRef} width="600" height="500" />
      {imageUrl && <img id="myimage" src={imageUrl} alt="rrr" ref={imageRef} />}
      <div>{/* <div ref={stripRef} /> */}</div>
      <div>{imageUrl}</div>
    </div>
  );
};

export default Detection;
