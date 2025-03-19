const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userScehma = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userScehma.plugin(passportLocalMongoose, {
  errorMessages: {
    MissingPasswordError: 'パスワードを入力してください。',
    AttemptTooSoonError: '現在アカウントがロックされています。時間を空けてから再度お試しください。',
    TooManyAttemptsError: 'ログイン失敗が続いたため、アカウントをロックしました。',
    NoSaltValueStoredError: '認証に失敗しました',
    IncorrectPasswordError: 'パスワードまたはユーザー名が間違っています。',
    IncorrectUsernameError: 'パスワードまたはユーザー名が間違っています。',
    UserExistsError: 'そのユーザー名はすでに使われています。',
  }
});

module.exports = mongoose.model('User', userScehma);