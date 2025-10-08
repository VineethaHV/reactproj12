const Appointment = require('../models/Appointment');

exports.createAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.create({ ...req.body, user: req.user._id });
    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const { date, status, clientName } = req.query;
    let query = {};
    if (date) query.date = { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24*60*60*1000) };
    if (status) query.status = status;
    if (clientName) query.clientName = { $regex: clientName, $options: 'i' };
    const appointments = await Appointment.find(query)
      .populate('user', 'name username')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user', 'name username');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    next(err);
  }
};