from __future__ import annotations

from .content_pack import ContentPack

_PACKS: dict[str, ContentPack] = {}


def register_content_pack(pack: ContentPack) -> None:
    _PACKS[pack.packId] = pack


def get_content_pack(pack_id: str) -> ContentPack | None:
    return _PACKS.get(pack_id)


def list_content_packs() -> list[ContentPack]:
    return list(_PACKS.values())


def clear_content_packs_for_test() -> None:
    _PACKS.clear()
