const local = require("./localStrategy");
const kakao = require("./kakaoStrategy");
const { User } = require("../models");

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findOne({
        where: { id },
        include: [
          {
            models: User,
            attributes: ["id", "nick"],
            as: "Followers",
          },
          {
            model: User,
            attributes: ["id", "nick"],
            as: "Followings",
          },
        ],
      });
      done(null, user);
    } catch (e) {
      done(e);
    }
  });

  local(passport);
  kakao(passport);
};
