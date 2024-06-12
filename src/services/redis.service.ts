import * as redis from 'redis';
import { config } from '../config';

class CacheService{
    private client;
    constructor(){
        this.client = redis.createClient({
            socket:{
                 host: config.redis.host,
                port: config.redis.port
            }
        });
        this.client.on('error', (err) => console.error('Redis error:', err));
    }
    async connect(){
        try {
            await this.client.connect();
            console.log("Connected to Redis!");
        } catch (error) {
            console.error("Failed to connect to Redis: ", error);
        }
    }
    async get(key:string){
        try {
            const data = await this.client.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error("Error with Redis GET: ", error);
        }
    }
    async set(key:string, value: any, expInSec = 3600){
        try {
            await this.client.setEx(key, expInSec,value);
        } catch (error) {
            console.error("Error with Redis SET: ", error);
        }
    }
    async del(key:string){
        try {
            await this.client.del(key);
        } catch (error) {
            console.error("Error with Redis DEL: ", error);
        }
    }
    async delByPattern(pattern:string){
        try {
            const keys = await this.client.keys(pattern);
            if(keys.length>0){
                await this.client.del(keys);
            }
        } catch (error) {
            console.error("Error with deleting by pattern in Redis: ", error);
        }
    }
}

export const cachService = new CacheService();