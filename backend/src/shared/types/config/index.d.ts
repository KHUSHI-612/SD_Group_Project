import { StringValue } from "ms";
export interface Config {
    port: number;
    nodeEnv: string;
    databaseUrl?: string;
    cors: {
        origins: string[];
    };
    cloudinary: {
        cloudName?: string;
        apiKey?: string;
        apiSecret?: string;
    };
    jwt: {
        secret: string;
        accessTokenExpiry: StringValue | number;
        refreshTokenExpiry: StringValue | number;
    };
}