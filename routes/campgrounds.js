const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controller/campgrounds');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

router.route('/')
  .get(catchAsync(campgrounds.index)) /* キャンプ場の一覧ページ */
  .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground)); /* 登録処理 */

router.get('/new', isLoggedIn, catchAsync(campgrounds.renderNewForm)); /* キャンプ場の新規登録ページ */

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground)) /* キャンプ場の詳細ページ */
  .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) /* 更新処理 */
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)); /* 削除処理 */

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm)); /* キャンプ場の編集ページ */

module.exports = router;