import { envVar } from "../config/env";
import { IAuthProviders, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      email: envVar.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExists) {
      // eslint-disable-next-line no-console
      console.log("Super Admin Already Exists");
      return;
    }

    // eslint-disable-next-line no-console
    console.log("Super Admin Creating...");

    const authProvider: IAuthProviders = {
      provider: "credentials",
      providerId: envVar.SUPER_ADMIN_EMAIL,
    };

    const hashedPass = await bcrypt.hash(
      envVar.SUPER_ADMIN_PASSWORD,
      Number(envVar.BCRYPT_SALT_ROUND)
    );

    const payload: IUser = {
      name: "Super Admin",
      email: envVar.SUPER_ADMIN_EMAIL,
      password: hashedPass,
      role: Role.SUPER_ADMIN,
      isVerified: true,
      auths: [authProvider],
    };

    const result = await User.create(payload);

    // eslint-disable-next-line no-console
    console.log("Super Admin created successfully...", result);
  } catch (error) {

    // eslint-disable-next-line no-console
    console.log(error);
  }
};
