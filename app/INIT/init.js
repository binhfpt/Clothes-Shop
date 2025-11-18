import Redis from "ioredis"
import { connect } from "@/app/dbConfig/dbConfig";

connect()
export default local_redis = new Redis(
    {
        host: "127.0.0.1",
        port: 6379,
    }
)