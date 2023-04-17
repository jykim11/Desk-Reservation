"""Reservation API

This API is used to modify available resources."""

from fastapi import APIRouter, Depends, HTTPException
from ..models import User, Desk, DeskReservation
from ..services import ResService, UserPermissionError
from .authentication import registered_user

api = APIRouter(prefix="/api/reservation")

@api.get("", tags=['Reservation'])
def list_desks(desk_res: ResService = Depends()):
    try:
        return desk_res.list_desks()
    except UserPermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

@api.get("/desk_reservations", tags=['Reservation'])
def list_desk_reservations(subject : User = Depends(registered_user), desk_res: ResService = Depends()):
    try:
        return desk_res.list_desk_reservations_by_user(subject)
    except UserPermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

# available desks
@api.get("/available", tags=['Reservation'])
def list_available_desks(desk_res: ResService = Depends()):
    try:
        return desk_res.list_available_desks()
    except UserPermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

# reserve desk
@api.post("/reserve", tags=['Reservation'])
def reserve_desk(desk: Desk, reservation: DeskReservation, subject : User = Depends(registered_user), desk_res: ResService = Depends()):
    try:
        return desk_res.create_desk_reservation(desk, subject, reservation)
    except UserPermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

# unreserve desk
@api.post("/unreserve", tags=['Reservation'])
def unreserve_desk(desk: Desk, reservation: DeskReservation, subject : User = Depends(registered_user), desk_res: ResService = Depends()):
    try:
        return desk_res.remove_desk_reservation(desk, subject, reservation)
    except UserPermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))