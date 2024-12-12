import { ITokenPayload } from "../interfaces/token.interface";

declare global {
  namespace Express {
    interface Response {
      locals: {
        tokenId?: string;
        jwtPayload?: ITokenPayload;
        actionPayload?: any;
      };
    }
  }
}
