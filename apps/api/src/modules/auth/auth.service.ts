import { HTTPSTATUS } from "../../config/http.config";
import type { ProviderEnumType } from "../../enums/account-provider.enum";
import { ErrorCodeEnum } from "../../enums/error-code.enum";
import AccountModel from "../../models/account.model";
import UserModel from "../../models/user.model";
import { BadRequestError, NotFoundError } from "../../utils/appError";

export const googleLoginOrRegisterService = async (body: {
  provider: ProviderEnumType;
  providerId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken?: string;
}) => {
  const { provider, providerId, email, name, accessToken, refreshToken } = body;

  const existingAccount = await AccountModel.findOne({ provider, providerId });

  if (existingAccount) {
    existingAccount.accessToken = accessToken;
    if (refreshToken) existingAccount.refreshToken = refreshToken;
    await existingAccount.save();

    const user = await UserModel.findById(existingAccount.userId);
    if (!user) {
      throw new Error("Account exists but linked user profile was not found.");
    }
    return { user, isNewUser: false };
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    const linkedAccount = await AccountModel.findOne({
      userId: existingUser._id,
    });

    if (linkedAccount && linkedAccount.provider !== provider) {
      const formatProvider =
        linkedAccount.provider === "EMAIL"
          ? "an email and password"
          : linkedAccount.provider;

      throw new Error(
        `This email is already associated with an account using ${formatProvider}. Please log in using your original method.`,
      );
    }
    const newAccount = await AccountModel.create({
      userId: existingUser._id,
      provider,
      providerId,
      accessToken,
      refreshToken,
    });

    return { user: existingUser, isNewUser: false };
  }

  const newUser = await UserModel.create({
    email,
    name,
    username: "@newuser",
  });

  await AccountModel.create({
    userId: newUser._id,
    provider,
    providerId,
    accessToken,
    refreshToken,
  });

  return { user: newUser, isNewUser: true };
};

export const registerUserService = async (body: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  const { name, username, email, password } = body;

  const existingUser = await UserModel.findOne({ email });
  const existingAccount = await AccountModel.findOne({
    provider: "EMAIL",
    providerId: email,
  });

  if (existingUser || existingAccount) {
    throw new BadRequestError(
      "User with this email already exists. Please Login",
      HTTPSTATUS.BAD_REQUEST,
      ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS,
    );
  }

  const user = new UserModel({
    name,
    username,
    email,
  });
  await user.save();

  const account = new AccountModel({
    provider: "EMAIL",
    providerId: email,
    userId: user._id,
    password: password,
  });
  await account.save();

  return { user: user.toObject() };
};



export const loginUserService = async (body :{ email : string , password : string}) => {

  const {email , password} = body

  const user = await UserModel.findOne({email})

  if(!user) {
    throw new NotFoundError("User not found")
  }

  const userAccount = await AccountModel.findOne({provider:"EMAIL" , providerId : email})


  if(!userAccount) {
    throw new BadRequestError("Account not found")
  }


  const isPasswordMatch = await userAccount.comparePassword(password)
  if(!isPasswordMatch) {
    throw new BadRequestError("Innvalid crendetilas")
  }


  return {user}

}