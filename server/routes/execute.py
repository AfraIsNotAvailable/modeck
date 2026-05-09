from fastapi import APIRouter, HTTPException, Query
import store
import executor

router = APIRouter()


@router.post("/execute/{button_id}")
def execute_button(button_id: str, long_press: bool = Query(False, alias="longPress")):
    button = store.get_by_id(button_id)
    if not button:
        raise HTTPException(status_code=404, detail="Button not found")
    action = button.get("longPressAction") if long_press else button["action"]
    if not action:
        raise HTTPException(status_code=400, detail="No action configured")
    success = executor.execute(action)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to execute action")
    return {"status": "ok"}
