import Redis from "ioredis";

let redis: Redis | null = null;

export function getRedis() {
    if (!redis) {
        redis = new Redis({
            host: "127.0.0.1",
            port: 6379,
        });
    }
    return redis;
}
