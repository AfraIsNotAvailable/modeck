from fastapi import APIRouter, HTTPException
import store

router = APIRouter()

@router.get("/buttons")
def get_buttons():
    return store.get_all()


@router.post("/buttons")
def create_button(button: dict):
    return store.create(button)


@router.put("/buttons/{button_id}")
def update_button(button_id: str, button: dict):
    updated = store.update(button_id, button)
    if not updated:
        raise HTTPException(status_code=404, detail="Button not found")
    return updated


@router.delete("/buttons/{button_id}")
def delete_button(button_id: str):
    if not store.delete(button_id):
        raise HTTPException(status_code=404, detail="Button not found")
    return {"status": "ok"}