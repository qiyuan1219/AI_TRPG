"""
主入口 —— D&D 碎冠之影 FastAPI 服务
"""
import sys
import io

# 修复 Windows 终端中文乱码
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes_dnd import router_dnd
from config import HOST, PORT, CORS_ORIGINS

app = FastAPI(
    title="碎冠之影 D&D TRPG",
    description="碎冠之影 - AI Dungeon Master (DM) 服务",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册 D&D 路由
app.include_router(router_dnd)


@app.get("/")
async def root():
    return {
        "game": "碎冠之影",
        "service": "AI-DM (地下城主)",
        "docs": "/docs",
        "api": "/api/dnd",
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=True,
        log_level="info",
    )
