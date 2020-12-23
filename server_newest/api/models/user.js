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
          id: "",
          name: "AK47",
          details: {
            "Load ammo": 30,
            "Total ammo": 90,
            Type: "Rifle",
            Delay: "0.12",
            Dame: 7,
            "Bullet speed": 200,
            "Bullet drop": 3,
          },
          thumbnail:
            "https://i.ibb.co/2vXFgrt/Screenshot-2020-12-02-082158.png",
          description: "Súng trường tự động Kalashnikov",
          boughtAt: new Date(),
        },
      ],
      hats: [
        {
          id: "",
          name: "Noob Hat",
          details: {
            HP: "100",
            Amor: "10",
            "Buff speed": 3,
          },
          thumbnail: "https://i.ibb.co/5RpGjC6/Noob-Hat.png",
          description: "Nón tân thủ",
          boughtAt: new Date(),
        },
      ],
      outfits: [
        {
          id: "",
          name: "Battery",
          details: {
            HP: "120",
            Amor: "20",
            "Buff speed": 3,
          },
          thumbnail: "https://i.ibb.co/YZqTM5v/Battery.png",
          description: "Giáp tân thủ",
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
