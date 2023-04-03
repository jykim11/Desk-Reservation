"""Reservation API

This API is used to modify available resources."""

from fastapi import APIRouter, Depends, HTTPException
from ..models import User
from ..services import ResService, UserPermissionError
from .authentication import registered_user

api = APIRouter(prefix="/api/reservation")

@api.get("", tags=['Reservation'])
def list_desks(desk_res: ResService = Depends()):
    try:
        return desk_res.listdesks()
    except UserPermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))