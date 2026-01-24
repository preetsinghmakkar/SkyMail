"""Redis connection manager for caching and session management."""
from app.utils import constants
from redis import asyncio as redis
from loguru import logger


class CacheManager: 
    
    def __init__(self):
        self.redis: redis.Redis | None = None 

    async def redis_connect(self, redis_url: str):
       if self.redis is None:
            try:
                self.redis = redis.from_url(
                    redis_url,
                    encoding="utf-8",
                    decode_responses=True,
                    max_connections=20,
                    retry_on_timeout=True,
                )
                await self.redis.ping()
                logger.info("Redis connection established.")
            except Exception as e:
                logger.warning(f"Redis connection failed: {str(e)}")  

    async def redis_disconnect(self):
        if self.redis:
            await self.redis.close()
            self.redis = None
            logger.info("Redis connection closed.")

    async def set(self, key: str, value: str, ex: int | None = None) -> bool:
        
        try:
            await self.redis.set(key, value, ex=ex)
            return True
        except Exception as e:
            logger.error(f"Redis SET error: {str(e)}")
            return False

    async def get(self, key: str) -> str | None:
        
        try:
            return await self.redis.get(key)
        except Exception as e:
            logger.error(f"Redis GET error: {str(e)}")
            return None

    async def delete(self, key: str) -> bool:
        
        try:
            await self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"Redis DELETE error: {str(e)}")
            return False

    async def setex(self, key: str, ex: int, value: str) -> bool:
        
        try:
            await self.redis.setex(key, ex, value)
            return True
        except Exception as e:
            logger.error(f"Redis SETEX error: {str(e)}")
            return False


redis_manager = CacheManager()
