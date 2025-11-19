import Pedido from "../models/pedido.js";

class PedidosController {

  // GET /api/pedidos - Listar todos
  // GET /api/pedidos - Listar todos
async listarPedidos(req, res) {
  try {
    let pedidos = await Pedido.find().populate('productos.producto');

    // Convertimos cada pedido para calcular subtotales y total
    pedidos = pedidos.map(p => {
      const pedido = p.toObject();

      pedido.productos = pedido.productos.map(item => {
        const precio = item.producto?.precio ?? 0;
        const subtotal = item.cantidad * precio;
        return { ...item, subtotal };
      });

      pedido.total = pedido.productos.reduce(
        (acc, item) => acc + item.subtotal,
        0
      );

      return pedido;
    });

    res.json({ status: 'ok', data: pedidos });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al listar pedidos' });
  }
}


  // GET /api/pedidos/:id - Obtener uno
async obtenerPedido(req, res) {
  try {
    let pedido = await Pedido.findById(req.params.id)
      .populate('productos.producto');

    if (!pedido) {
      return res.status(404).json({ status: 'error', message: 'Pedido no encontrado' });
    }

    // 💡 Calcular subtotales y total
    pedido = pedido.toObject();
    pedido.productos = pedido.productos.map(item => {
      const precio = item.producto?.precio ?? 0;
      const subtotal = item.cantidad * precio;
      return { ...item, subtotal };
    });

    pedido.total = pedido.productos.reduce((acc, item) => acc + item.subtotal, 0);

    res.json({ status: 'ok', data: pedido });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al obtener pedido' });
  }
}


  // POST /api/pedidos - Crear
  async crearPedido(req, res) {
    try {
      const doc = await Pedido.create(req.body);
      res.status(201)
        .location(`/api/pedidos/${doc._id}`)
        .json({ status: 'ok', data: doc });
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // PATCH /api/pedidos/:id - Actualizar
  async actualizarPedido(req, res) {
    try {
      const pedido = await Pedido.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!pedido) {
        return res.status(404).json({ status: 'error', message: 'Pedido no encontrado' });
      }
      res.json({ status: 'ok', data: pedido });
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  // DELETE /api/pedidos/:id - Eliminar
  async eliminarPedido(req, res) {
    try {
      const pedido = await Pedido.findByIdAndDelete(req.params.id);
      if (!pedido) {
        return res.status(404).json({ status: 'error', message: 'Pedido no encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', message: 'Error al eliminar pedido' });
    }
  }
}

export default new PedidosController();
