import {
  IUser,
  IUserListQuery,
  IUserResponse,
  IUserResponseList,
} from "src/interfaces/user.interface.js";

export class UserPresenter {
  public static toResponse(data: IUser): IUserResponse {
    return {
      _id: data._id,
      name: data.name,
      email: data.email,
      age: data.age,
      phone: data.phone,
      avatar: data.avatar,
      // ? `${configs.AWS_ENDPOINT_URL}/${configs.AWS_BUSKET_URL}/${data.avatar}`
      // : null,
      role: data.role,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      lastVisit: data.lastVisit,
    };
  }

  public static toResponseList(
    data: IUser[],
    total: number,
    query: IUserListQuery,
  ): IUserResponseList {
    return {
      data: data.map((item) => this.toResponse(item)),
      total,
      ...query,
    };
  }
}
