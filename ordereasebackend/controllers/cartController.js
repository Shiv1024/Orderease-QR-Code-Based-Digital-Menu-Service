const { CartItem } = require("../models/Cart");

exports.getCart = async (req, res) => {
  try {
    //   const userId = req.params.userId || "1";
    const { userId } = req.params;
    const cart = await CartItem.find({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error });
  }
};

exports.addToCart = async (req, res) => {
  const { userId } = req.params;
  const cart = new CartItem({ ...req.body, userId: userId });
  try {
    const data = await cart.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.removeCartItem = async (req, res) => {
  const { userId,name } = req.params;
  // const { name } = req.body;
  try {
    const cartItem = await CartItem.findOneAndDelete(
      { userId: userId, "dish.name": name }
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json({ message: "Cart item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing cart item", error });
  }
};
// exports.clearCartItem = async (req, res) => {
//   const { userId } = req.params;
//   console.log(userId);
//   try {
//     const cartItem = await CartItem.findByIdAndDelete( userId );

//     if (!cartItem) {
//       return res.status(404).json({ message: "Cart item not found" });
//     }

//     res.status(200).json({ message: "Cart items removed successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error removing cart item", error });
//   }
// };
exports.clearCartItem = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Assuming CartItem schema has a userId field
    const result = await CartItem.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Cart items not found" });
    }

    res.status(200).json({ message: "Cart items removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing cart items", error });
  }
};


exports.incrementCartItem = async (req, res) => {
  const { name } = req.body;
  const { userId } = req.params;
  console.log(req.body);
  try {
    const cartItem = await CartItem.findOneAndUpdate(
      { userId: userId, "dish.name": name},
      { $inc: { amount: 1 } },
      { new: true }
    );
    console.log(cartItem);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Error incrementing cart item", error });
  }
};
exports.decrementCartItem = async (req, res) => {
  const { name } = req.body;
  const { userId } = req.params;
  try {
    const cartItem = await CartItem.findOne({ userId: userId, "dish.name": name });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    if (cartItem.amount > 1) {
      cartItem.amount--;
      await cartItem.save();
      res.status(200).json(cartItem);
    } else {
      res.status(200).json(cartItem);
    }
  } catch (error) {
    res.status(500).json({ message: "Error decrementing cart item", error });
  }
};
