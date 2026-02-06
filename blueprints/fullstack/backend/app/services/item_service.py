from sqlalchemy import select
from app.models.item import Base, Item
from app.database import get_session

class ItemService:
    @staticmethod
    def get_all():
        session = next(get_session())
        return session.execute(select(Item)).scalars().all()
    
    @staticmethod
    def get_by_id(item_id: int):
        session = next(get_session())
        return session.execute(select(Item).where(Item.id == item_id)).scalar_one_or_none()
    
    @staticmethod
    def create(item_data: dict):
        session = next(get_session())
        item = Item(**item_data)
        session.add(item)
        session.commit()
        session.refresh(item)
        return item