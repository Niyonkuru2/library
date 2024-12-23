import express from 'express'
import {createReservation,getAllReservations,getReservationById,getReservationsByMember,returnReservedBook,cancelReservation,issuedAndReservedBook} from '../controllers/reservationControllers.js'


const reservationRouter = express.Router()
reservationRouter.post('/addreservation',createReservation),
reservationRouter.get('/getallreservation',getAllReservations)
reservationRouter.get('/reservations/:reservationId',getReservationById),
reservationRouter.get('/member/:membershipCode',getReservationsByMember)
reservationRouter.put('/return',returnReservedBook)
reservationRouter.get('/reservations/:membershipCode',issuedAndReservedBook);
reservationRouter.delete('/reservations/cancel',cancelReservation);

export default reservationRouter