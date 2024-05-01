var express = require("express");
var router = express.Router();
const {
  imageStorage,
  videoStorage,
  documentStorage,
  image,
  document,
  video,
} = require("../libs/multer");

const User = require("./auth.routes")
router.use("/api/v1", User)

router.post("/upload/image", imageStorage.single("image"), (req, res) => {
  let imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
  res.render("uploadedImage", { image_url: imageUrl });

  //   jika mau tampilan json

  //     res.json({
  //     image_url: imageUrl
  //   })
});

// upload multiple images
router.post("/upload/images", imageStorage.array("image"), (req, res) => {
  let imagesUrl = req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/images/${file.filename}`;
  });
  res.json({ images_url: imagesUrl });
});

// single video (mp4,mpeg)
router.post("/upload/video", videoStorage.single("video"), (req, res) => {
  let videoUrl = `${req.protocol}://${req.get("host")}/videos/${
    req.file.filename
  }`;
  res.render("uploadedVideo", { video_url: videoUrl });
});

// multiple video
router.post("/upload/videos", videoStorage.array("video"), (req, res) => {
  let videosUrl = req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/videos/${file.filename}`;
  });
  res.json({ videos_url: videosUrl });
});

// single file
router.post(
  "/upload/document",
  documentStorage.single("document"),
  (req, res) => {
    let documentUrl = `${req.protocol}://${req.get("host")}/documents/${
      req.file.filename
    }`;
    res.render("uploadedDocument", { document_url: documentUrl });
  }
);

// multiple file
router.post(
  "/upload/documents",
  documentStorage.array("document"),
  (req, res) => {
    let documentsUrl = req.files.map(
      (file) =>
        `${req.protocol}://${req.get("host")}/documents/${file.filename}`
    );
    res.json({ documents_url: documentsUrl });
  }
);

const {
  imageKitUpload,
  generateQR,
} = require("../controllers/media.controllers");
router.post("/imagekit/upload/image", image.single("file"), imageKitUpload);
router.post(
  "/imagekit/upload/document",
  document.single("file"),
  imageKitUpload
);
router.post("/imagekit/upload/video", video.single("file"), imageKitUpload);

router.post("/qr/generate", generateQR);

module.exports = router;