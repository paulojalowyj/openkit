from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env', env_file_encoding='utf-8', extra='ignore'
    )

    DB_USER: str = 'postgres'
    DB_PASSWORD: str = 'postgres'
    DB_HOST: str = 'localhost'
    DB_PORT: int = 5432
    DB_NAME: str = '{{PROJECT_IDENTIFIER}}'

    @property
    def DATABASE_URL(self) -> str:
        return (
            f'postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}'
            f'@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}'
        )

    REDIS_HOST: str = 'localhost'
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str | None = None
    REDIS_DB: int = 0

    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return (
                f'redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:'
                f'{self.REDIS_PORT}/{self.REDIS_DB}'
            )
        return f'redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}'