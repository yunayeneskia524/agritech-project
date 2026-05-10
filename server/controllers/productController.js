const Product = require("../models/Product");
const Order = require("../models/Order");

// Seed default products jika kosong
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: "Pupuk NPK Mutiara", category: "pupuk", description: "NPK 16-16-16 untuk semua jenis tanaman", price: 85000, unit: "kg", stock: 500 },
      { name: "Pupuk Urea", category: "pupuk", description: "Nitrogen tinggi untuk pertumbuhan vegetatif", price: 65000, unit: "kg", stock: 800 },
      { name: "Pupuk Organik Kompos", category: "pupuk", description: "Pupuk organik ramah lingkungan", price: 35000, unit: "kg", stock: 1000 },
      { name: "Pestisida Dursban", category: "pestisida", description: "Insektisida untuk hama serangga", price: 120000, unit: "liter", stock: 200 },
      { name: "Fungisida Benlate", category: "pestisida", description: "Anti jamur untuk berbagai tanaman", price: 95000, unit: "liter", stock: 150 },
      { name: "Benih Padi IR64", category: "benih", description: "Varietas unggul tahan penyakit", price: 45000, unit: "kg", stock: 300 },
      { name: "Benih Jagung Manis", category: "benih", description: "Jagung manis hibrida produktivitas tinggi", price: 75000, unit: "kg", stock: 250 },
      { name: "Cangkul Stainless", category: "alat", description: "Cangkul berkualitas tinggi tahan karat", price: 185000, unit: "pcs", stock: 50 },
    ]);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    await seedProducts();
    const { category } = req.query;
    const filter = category && category !== "semua" ? { category } : {};
    const products = await Product.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, data: products });
  } catch (e) { next(e); }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { items, address } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: "Tidak ada item" });
    let totalPrice = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ success: false, message: `Produk tidak ditemukan` });
      if (product.stock < item.quantity) return res.status(400).json({ success: false, message: `Stok ${product.name} tidak cukup` });
      totalPrice += product.price * item.quantity;
      orderItems.push({ productId: product._id, name: product.name, price: product.price, quantity: item.quantity });
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }
    const order = await Order.create({ userId: req.user.id, items: orderItems, totalPrice, address: address || "" });
    res.status(201).json({ success: true, message: "Pesanan berhasil dibuat", data: order });
  } catch (e) { next(e); }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (e) { next(e); }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (e) { next(e); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: "Order tidak ditemukan" });
    res.json({ success: true, data: order });
  } catch (e) { next(e); }
};
