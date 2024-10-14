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
      const data = {message: 'Success'};
      publishMesage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
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
