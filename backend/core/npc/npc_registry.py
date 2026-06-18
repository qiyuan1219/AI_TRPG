from __future__ import annotations

from .npc_profile import NPCProfile


NPC_REGISTRY: list[NPCProfile] = [
    NPCProfile(id="selin", name="瑟琳", aliases=["银杖瑟琳", "serin"], role="法术支援", speechStyle="冷静、谨慎、重视纪律", trustKey="serin"),
    NPCProfile(id="ailin", name="艾琳", aliases=["白枝"], role="生命牧师", speechStyle="温和、专业、重视生命", trustKey="ailin"),
    NPCProfile(id="brock", name="布洛克", aliases=["森洛", "铁锚"], role="孢海向导", speechStyle="粗粝、务实、熟悉孢海", trustKey="brock"),
    NPCProfile(id="kaiya", name="凯娅", aliases=["克莱娅", "软爪"], role="盗贼猎手", speechStyle="警觉、机敏、少说废话", trustKey="kaiya"),
]


def get_npc_profile(id_or_alias: str) -> NPCProfile | None:
    key = id_or_alias.strip().lower()
    for profile in NPC_REGISTRY:
        if profile.id.lower() == key or profile.name.lower() == key:
            return profile
        if any(alias.lower() == key for alias in profile.aliases):
            return profile
    return None


def validate_npc_profiles(profiles: list[NPCProfile]) -> dict[str, object]:
    seen_ids: set[str] = set()
    duplicate_ids: list[str] = []
    for profile in profiles:
        if profile.id in seen_ids:
            duplicate_ids.append(profile.id)
        seen_ids.add(profile.id)
    return {"valid": len(duplicate_ids) == 0, "duplicateIds": duplicate_ids}
