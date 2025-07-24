import mongoose, {Document, Schema} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUSER extends Document {
  name: string;
  email: string;
  password?: string;
  googleID?: string;
  profilePicture?: string;
  phoneNumber?: string;
  isVerified: boolean;
  varificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  agreeTerms: boolean;
  addresses: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string) : Promise<boolean>;
}

const userSchema = new Schema<IUSER>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  googleID: { type: String},
  profilePicture: { type: String, default:null},
  phoneNumber: { type: String, default:null},
  isVerified: { type: Boolean, default: false},
  varificationToken: { type: String, default:null},
  resetPasswordToken: { type: String, default:null},
  resetPasswordExpire: { type: Date, default:null},
  agreeTerms: { type: Boolean, default: false },
  addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password!);
};

export default mongoose.model<IUSER>('User', userSchema);