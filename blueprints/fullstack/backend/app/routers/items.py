from fastapi import APIRouter
from app.services.item_service import ItemService
from app.schemas.item import ItemCreate, ItemResponse

router = APIRouter(prefix='/items', tags=['items'])

@router.get('/', response_model=list[ItemResponse])
def list_items():
    return ItemService.get_all()

@router.get('/{item_id}', response_model=ItemResponse)
def get_item(item_id: int):
    item = ItemService.get_by_id(item_id)
    if not item:
        raise ValueError(f'Item {item_id} not found')
    return item

@router.post('/', response_model=ItemResponse, status_code=201)
def create_item(item: ItemCreate):
    return ItemService.create(item.model_dump())