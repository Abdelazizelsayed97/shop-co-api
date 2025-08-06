
import mongoose from 'mongoose';
import AddressModel, { IAddress } from '../models/adress_model';
import UserModel from '../models/user_model';

export const createAddress = async (userId: string, addressData: Partial<IAddress>): Promise<IAddress> => {
    if (!userId) {
        throw new Error('User ID is required.');
    }
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.zipCode) {
        throw new Error('Street, city, state, and zip code are required for creating an address.');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found.');
    }

    const address = new AddressModel({
        ...addressData,
        user: userId,
    });

    await address.save();

    user.addresses.push(address._id);
    await user.save();

    return address;
};

export const getAddressesByUser = async (userId: string): Promise<IAddress[]> => {
    if (!userId) {
        throw new Error('User ID is required to get addresses by user.');
    }
    return await AddressModel.find({ user: userId });
};

export const getAddressById = async (addressId: string): Promise<IAddress | null> => {
    if (!addressId) {
        throw new Error('Address ID is required to get an address by ID.');
    }
    return await AddressModel.findById(addressId);
};

export const updateAddress = async (addressId: string, addressData: Partial<IAddress>): Promise<IAddress | null> => {
    if (!addressId) {
        throw new Error('Address ID is required for updating.');
    }
    if (Object.keys(addressData).length === 0) {
        throw new Error('No update data provided.');
    }
    return await AddressModel.findByIdAndUpdate(addressId, addressData, { new: true });
};

export const deleteAddress = async (userId: string, addressId: string): Promise<void> => {
    if (!userId || !addressId) {
        throw new Error('User ID and Address ID are required for deleting an address.');
    }

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new Error('User not found.');
    }

    const address = await AddressModel.findById(addressId);
    if (!address) {
        throw new Error('Address not found.');
    }

    if (user.id.toString() !== userId) {
        throw new Error('Address does not belong to the specified user.');
    }

    await AddressModel.findByIdAndDelete(addressId);

    await UserModel.findByIdAndUpdate(userId, { $pull: { addresses: addressId } });
};
