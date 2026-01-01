import Address from "../models/AddressModel.js";
import logger from "../utils/logger.js";
import sanitize from "mongo-sanitize";

export const createAdderss = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const body = sanitize(req.body);

    // Count existing address
    const addressCount = await Address.countDocuments({ userId });
    if (addressCount >= 2) {
      return res.status(400).json({
        success: false,
        message: "Max 2 addresses allowed",
      });
    }

    // If it's the first address, force it to be default
    if (addressCount === 0) body.isDefault = true;

    const newAddress = await Address.create({ ...body, userId });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in create address ${error.message}`);
  }
};

export const getAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ userId }).sort({ isDefault: -1 });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in get address ${error.message}`);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;
    const body = sanitize(req.body);

    const address = await Address.findOne({
      _id: addressId,
      userId,
    });
    if (!address)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });

    Object.assign(address, body);
    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    next(error);
    logger.error(`Error in update address ${error.message}`);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const address = await Address.findOneAndDelete({ _id: addressId, userId });
    if (address?.isDefault) {
      await Address.findOneAndUpdate(
        { userId: req.user.id },
        { isDefault: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
    logger.error(`Error in delete address ${error.message}`);
  }
};
