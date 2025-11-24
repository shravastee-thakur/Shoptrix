import Address from "../models/AddressModel.js";
import logger from "../utils/logger.js";

export const createAdderss = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Count existing address
    const addressCount = await Address.countDocuments({ userId });
    if (addressCount >= 2) {
      return res.status(400).json({
        success: false,
        message: "You can only add up to 2 addresses",
      });
    }

    const { fullName, phoneNumber, address, city, state, pinCode, isDefault } =
      req.body;

    let finalDefault = false;

    if (addressCount === 0) {
      finalDefault = true;
    } else if (isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      );
      finalDefault = true;
    }

    const newAddress = await Address.create({
      userId,
      fullName,
      phoneNumber,
      address,
      city,
      state,
      pinCode,
      isDefault: finalDefault,
    });

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

    const updateData = req.body;

    if (updateData.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addressId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress,
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

    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await Address.deleteOne();

    if (address.isDefault) {
      const nextAddress = await Address.findOne({ userId });
      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
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
