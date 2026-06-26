// Write Core Drive & Sharing Logic
// to govern files, folders, and shared link actions.

const { PrismaClient } = require('@prisma/client');
const { uploadToCloud } = require('../services/cloudinary');
const prisma = new PrismaClient();

// Query files and folders matching the current navigation directory view
exports.getDashboard = async (req, res) => {
  const currentFolderId = req.query.folderId || null;

  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id, parentId: currentFolderId }
  });

  const files = await prisma.file.findMany({
    where: { userId: req.user.id, folderId: currentFolderId }
  });

  res.render('dashboard', { user: req.user, folders, files, currentFolderId });
};

// Insert a new folder instance connected to the user
exports.createFolder = async (req, res) => {
  const { name, parentId } = req.body;
  await prisma.folder.create({
    data: { name, parentId: parentId || null, userId: req.user.id }
  });
  res.redirect(parentId ? `/?folderId=${parentId}` : '/');
};

// Process multer upload file data up into cloud records mapping
exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).send('Upload rejected or empty file field.');
  const { folderId } = req.body;

  try {
    const cloudFile = await uploadToCloud(req.file.path);
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        url: cloudFile.url,
        publicId: cloudFile.publicId,
        userId: req.user.id,
        folderId: folderId || null
      }
    });
    res.redirect(folderId ? `/?folderId=${folderId}` : '/');
  } catch (err) {
    res.status(500).send(`Cloud Storage Engine upload error: ${err.message}`);
  }
};

// Fetch single metadata properties for file inspection page view
exports.getFileDetails = async (req, res) => {
  const file = await prisma.file.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  
  if (!file) return res.status(404).send('File record matching parameters not found.');
  res.render('file-details', { file });
};

// Set custom expiration tracking strings for folders
exports.shareFolder = async (req, res) => {
  const { duration } = req.body; // Comes across as "1" or "10" days
  const days = parseInt(duration, 10);
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const sharedLink = await prisma.sharedLink.create({
    data: { folderId: req.params.id, expiresAt }
  });

  res.send(`Share token deployed! Valid link output for ${days} days: <br> <strong>http://localhost:3000/share/${sharedLink.id}</strong>`);
};

// Public non-authenticated link evaluator checkpoint view
exports.getSharedFolder = async (req, res) => {
  const share = await prisma.sharedLink.findUnique({
    where: { id: req.params.shareId },
    include: { folder: { include: { files: true, children: true } } }
  });

  if (!share) return res.status(404).send('This share link record is invalid.');
  // Hard block user if current calendar timestamp has surpassed expiry mark
  if (new Date() > share.expiresAt) return res.status(410).send('This sharing access link has expired.');

  res.render('shared-viewer', { folder: share.folder });
};
