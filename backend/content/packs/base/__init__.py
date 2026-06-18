from content.core.content_pack import ContentPack
from core.npc.npc_registry import NPC_REGISTRY

BASE_CONTENT_PACK = ContentPack(
    packId="base",
    version="1.0.0",
    title="地心之门 Base Content",
    npcs=NPC_REGISTRY,
)
