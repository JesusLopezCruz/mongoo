import mongoose from 'mongoose';

// Definimos el esquema
const pedidoSchema = new mongoose.Schema({
  cliente: { type: String, trim: true },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true, min: 1, default: 1 }
  }],
  total: { type: Number, min: 0 },
  estado: { type: String, enum: ['pendiente', 'completado', 'cancelado'], default: 'pendiente' }
}, { timestamps: true });

// Creamos el modelo
const Pedido = mongoose.model('Pedido', pedidoSchema);

export default Pedido;
