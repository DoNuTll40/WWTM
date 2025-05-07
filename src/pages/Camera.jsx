import { useRef, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { Camera } from "react-camera-pro";

const FaceDetection = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null); // เก็บภาพต้นฉบับ
  const [isOpen, setIsOpen] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [matchResult, setMatchResult] = useState(null); // เก็บผลการเปรียบเทียบ
  const canvasInRef = useRef(null);
  const canvasOutRef = useRef(null);

  useEffect(() => {
    const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights'

    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        ]);
        console.log("✅ โมเดลโหลดเสร็จแล้ว!");
        setIsModelLoaded(true);
      } catch (error) {
        console.error("❌ โหลดโมเดลผิดพลาด:", error);
      }
    };
    loadModels();
  }, []);

  const handleTakePhoto = () => {
    if (!referenceImage) {
      console.error("❌ กรุณาเลือกภาพต้นฉบับก่อน!");
      return; // ถ้ายังไม่มีภาพต้นฉบับ จะไม่ให้ถ่ายภาพ
    }

    if (!camera.current) {
      console.error("❌ กล้องยังไม่พร้อม!");
      return;
    }

    const capturedImage = camera.current.takePhoto();
    if (!capturedImage) {
      console.error("❌ ถ่ายภาพไม่สำเร็จ!");
      return;
    }

    setImage(capturedImage);
  };

  const handleImageLoad = async () => {
    if (!image || !referenceImage) return;
    if (!isModelLoaded) {
      console.error("❌ โมเดลยังโหลดไม่เสร็จ!");
      return;
    }
  
    const img = document.getElementById("taken-photo");
    const refImg = document.getElementById("reference-photo");
    const canvas = canvasOutRef.current;
    if (!img || !refImg || !canvas) return;
  
    const displaySize = { width: img.width, height: img.height };
    faceapi.matchDimensions(canvas, displaySize);
  
    // ตรวจจับใบหน้าและคำนวณ descriptor ของภาพต้นฉบับ
    const referenceDetection = await faceapi
      .detectSingleFace(refImg, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
  
    if (!referenceDetection) {
      console.error("❌ ไม่พบใบหน้าในภาพต้นฉบับ!");
      setMatchResult("❌ ไม่พบใบหน้าในภาพต้นฉบับ!")
      return;
    }
  
    // ตรวจจับใบหน้าและคำนวณ descriptor ของภาพที่ถ่ายจากกล้อง
    const capturedDetections = await faceapi
      .detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 }))
      .withFaceLandmarks()
      .withFaceDescriptors();
  
    if (capturedDetections.length === 0) {
      console.error("❌ ไม่พบใบหน้าในภาพที่ถ่ายจากกล้อง!");
      setMatchResult("❌ ไม่พบใบหน้าในภาพที่ถ่ายจากกล้อง!");
      return;
    }
  
    // สร้าง faceMatcher จากภาพต้นฉบับ
    const faceMatcher = new faceapi.FaceMatcher([referenceDetection], 0.4);
  
    // เปรียบเทียบใบหน้า
    const results = capturedDetections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    );
  
    // ตรวจสอบผลลัพธ์
    const bestMatch = results[0];
    const isMatch = bestMatch.distance < 0.4; // ลองเปลี่ยนเป็น 0.5

    // แสดงผลการเปรียบเทียบ
    setMatchResult(isMatch ? "✅ ตรงกัน" : "❌ ไม่ตรงกัน");
  
    // วาดผลลัพธ์บน canvas
    const resizedDetections = faceapi.resizeResults(capturedDetections, displaySize);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  };

  const handleReferenceImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setReferenceImage(reader.result);
  
        // ตรวจจับใบหน้าในภาพต้นฉบับ
        const img = document.createElement("img");
        img.src = reader.result;
        img.onload = async () => {
          const canvas = canvasInRef.current;

          const displaySize = { width: img.width, height: img.height };
          faceapi.matchDimensions(canvas, displaySize);
  
          // ตรวจจับใบหน้าในภาพต้นฉบับ
          const referenceDetection = await faceapi
            .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks()
            .withFaceDescriptor();
  
          if (!referenceDetection) {
            console.error("❌ ไม่พบใบหน้าในภาพต้นฉบับ!");
            setMatchResult("❌ ไม่พบใบหน้าในภาพต้นฉบับ!");
            return;
          }
  
          // วาดกรอบรอบใบหน้าบน canvas
          const resizedDetection = faceapi.resizeResults([referenceDetection], displaySize);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // เคลียร์ canvas ก่อน
            ctx.lineWidth = 10;
            faceapi.draw.drawDetections(canvas, resizedDetection);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetection);
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="w-full my-4">
      {/* อัพโหลดภาพต้นฉบับ */}
      <div className="flex gap-2 justify-around">
      <div className="">
        <input
          type="file"
          accept="image/*"
          onChange={handleReferenceImageUpload}
          className="my-2 file:bg-gray-100 file:border-none file:p-2 file:rounded-md hover:cursor-pointer file:cursor-pointer"
          placeholder="เลือกภาพ"
        />
        {referenceImage && (
          <div className="my-2 relative">
            <img
              id="reference-photo"
              src={referenceImage}
              alt="Reference"
              className="max-w-[25vw] shadow-md rounded-md"
            />
            <canvas
              ref={canvasInRef}
              className="absolute top-0 left-0 max-w-[25vw] "
            />
          </div>
        )}

              {/* ✅ แสดงผลการเปรียบเทียบ */}
      {matchResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <p className="text-lg font-semibold">ผลการเปรียบเทียบ:</p>
          <p>{matchResult}</p>
        </div>
      )}
      </div>

      <div className="w-[35vw]">
        <Camera aspectRatio={4 / 3} ref={camera} />
        <button
          className={`bg-blue-gray-800 text-white p-4 w-full my-2 rounded-md font-semibold ${
            !isModelLoaded || !referenceImage ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleTakePhoto}
          disabled={!isModelLoaded || !referenceImage}
        >
          {isModelLoaded ? "📸 ถ่ายภาพ" : "⏳ กำลังโหลดโมเดล..."}
        </button>
        <button
          className="bg-red-800 text-white p-4 w-full my-2 rounded-md font-semibold"
          onClick={() => {
            setImage(null)
            setMatchResult(null)
          }}
        >
          ลบภาพ
        </button>
      </div>
      </div>

      <hr />
      {image && (
        <div className="relative">
          <img
            id="taken-photo"
            className="absolute right-10 bottom-10 max-w-[20rem] shadow-md rounded-md cursor-pointer"
            src={image}
            alt="Taken photo"
            onClick={() => setIsOpen(true)}
            onLoad={handleImageLoad}
          />
          <canvas
            ref={canvasOutRef}
            className="absolute right-10 bottom-10 max-w-[20rem]"
            onClick={() => setIsOpen(true)}
          />
        </div>
      )}

      {/* ✅ Modal แสดงภาพเต็มจอ */}
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/70 flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <img
            className="max-w-full max-h-full rounded-md shadow-lg"
            src={image || ""}
            alt="Full Size"
          />
          <canvas
            ref={canvasOutRef}
            className="absolute right-0 left-0 mx-auto z-[60] max-w-[20rem]"
            // onClick={() => setIsOpen(true)}
          />
        </div>
      )}
    </div>
  );
};

export default FaceDetection;