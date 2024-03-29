const mongoose = require("mongoose");

const DataSchema = mongoose.Schema(
  {
    avatar: { type: String, default: "" },
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
      minLength: [3, "name must be at least 5 characters"],
      maxLength: [24, "name must be maximum 24 characters"],
      match: [/^[a-zA-Z\s]*$/g, "only letters and spacess allowed"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "this email is already assossiated with another account"],
      trim: true,
      lowerCase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "not a valid email address",
      ],
    },
    phone: {
      type: String,
      unique: [
        true,
        "this phone number is already assossiated with another account",
      ],
      trim: true,
      match: [/^(?:(?:\+|00)88|01)?\d{11}\r?$/, "not a valid phone number"],
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: "gender is either male or female",
      },
      default: "",
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password should be at least 8 characters"],
      match: [
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$/,
        "not a valid password",
      ],
    },
    refreshToken: String,
    roles: {
      User: {
        type: Number,
        default: 5698,
      },
      Editor: {
        type: Number,
        default: 0,
      },
      Admin: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const usersModel = mongoose.model("users", DataSchema);

module.exports = usersModel;
