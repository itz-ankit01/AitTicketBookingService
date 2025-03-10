const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services/index");

const bookingService = new BookingService();

const { createChannel, publishMesage } = require('../utils/message-Queue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');


class BookingController {

  constructor(){

  }

  async sendMessageToQueue(req, res){
      const channel = await createChannel();
      const payload = {
        data: {
          subject: 'This is a noti from queue',
          content: 'Some queue will subscribe this',
          recepeintEmail: 'ankitsharma0004d@gmail.com',
          notificationTime: '2024-10-16T16:47:00'
        },
        service: 'CREATE_TICKET'
      };
      publishMesage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
      return res.status(200).json({
        message: 'Successfully published the event'
      });
  }


  async create (req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
  
      return res.status(StatusCodes.OK).json({
        message: "Successfully completed Booking",
        success: true,
        err: {},
        data: response,
      });
    } catch (error) {
  
      return res.status(error.statusCode).json({
        message: error.message,
        success: false,
        err: error.explanation,
        data: {},
      });
    }
  }
}

module.exports = BookingController;
