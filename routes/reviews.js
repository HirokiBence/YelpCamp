const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controller/reviews');

/* レビュー投稿処理 */
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.postReview))

/* レビュー削除処理 */
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync (reviews.deleteReview));

module.exports = router;