const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

const enu = {
  values: ["user", "admin"],
  message: `Roles must be 'user' or 'admin'!`,
};

const userScheme = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email!",
    ],
  },
  roles: {
    type: String,
    enum: enu,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  cash: {
    type: Number,
    default: 200000,
  },
  password: {
    type: String,
    default: "randomPasswordStringHere",
  },
  passwordResetToken: {
    type: String,
    default: "randomStringHere",
  },
  passwordResetExpires: {
    type: Date,
    default: Date.now(),
  },
  slugName: {
    type: String,
    slug: "name",
  },
  history: {
    type: Object,
    default: {
      manage: [],
      personal: [],
    },
  },
  items: {
    type: Object,
    default: {
      guns: [
        {
          id: "5fe3f186fef3da1f042997cd",
          name: "AK47",
          details: {
            "Load ammo": 30,
            "Total ammo": 90,
            Type: "Rifle",
            "Time delay": 0.12,
            Damage: 7,
            "Bullet speed": 200,
            "Bullet drop": 3,
          },
          thumbnail:
            "https://i.ibb.co/2vXFgrt/Screenshot-2020-12-02-082158.png",
          description: "Súng trường tự động Kalashnikov.",
          boughtAt: new Date(),
        },
      ],
      hats: [
        {
          id: "5fe3f88288e0a52be4dce664",
          name: "Noob Hat",
          details: {
            HP: 30,
            Ammo: 10,
            "Damage buff": 3,
            "Bullet speed down": 10,
            "Bullet drop down": 0.1,
          },
          thumbnail: "https://i.ibb.co/5RpGjC6/Noob-Hat.png",
          description: "Nón tân thủ, cấu hình bullpup thử nghiệm của Đức",
          boughtAt: new Date(),
        },
      ],
      outfits: [
        {
          id: "5fe3feb70351732f504287ef",
          name: "Battery",
          details: {
            HP: 40,
            Ammo: 10,
            "Damage buff": 1,
            "Bullet speed down": 10,
            "Bullet drop down": 0.5,
          },
          thumbnail: "https://i.ibb.co/YZqTM5v/Battery.png",
          description:
            "Giáp tân thủ, thiết kế và phát triển bởi Heckler & Koch.",
          boughtAt: new Date(),
        },
      ],
    },
  },
});

userScheme.path("name").validate(async (value) => {
  const nameCount = await mongoose.models.User.countDocuments({ name: value });
  return !nameCount;
}, "Name already exists!");

userScheme.path("email").validate(async (value) => {
  const emailCount = await mongoose.models.User.countDocuments({
    email: value,
  });
  return !emailCount;
}, "Email already exists!");

// Add plugins
mongoose.plugin(slug);
userScheme.set("timestamps", true);

module.exports = mongoose.model("User", userScheme);
