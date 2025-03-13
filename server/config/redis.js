import Redis from "ioredis";

const redis = new Redis(
  "redis://default:H6HvMThiZ8mFlZ5LFXweihYsovc51RBA@redis-16671.c252.ap-southeast-1-1.ec2.redns.redis-cloud.com:16671"
);

export default redis;
