import express from 'express';
import Message from '../dao/db/models/message.model.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Message.find();
    res.render('chat', { messages });
  } catch (error) {
    console.error('Error al obtener mensajes:', error.message);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;