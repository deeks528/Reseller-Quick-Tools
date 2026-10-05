import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Business } from '../models/Business.js';
import { Customer } from '../models/Customer.js';
import { Order } from '../models/Order.js';
import { ENV } from '../config/env.js';
import { formatPostalAddress } from '../utils/formatAddress.js';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(ENV.MONGODB_URI);
    console.log('[Seed] Connected.');

    // Clear existing data for clean demo
    await User.deleteMany({});
    await Business.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});
    console.log('[Seed] Cleared existing collections.');

    // 1. Create Business
    const businessCode = 'royal-boutique';
    const business = new Business({
      businessName: 'Royal Boutique',
      ownerName: 'Store Owner',
      mobileNumber: '9999999999',
      upiId: '9999999999@upi',
      businessCode,
      orderRetentionDays: 90
    });

    // 2. Create User
    const user = new User({
      email: 'dealer@resellertools.com',
      password: 'password123',
      name: 'Store Owner',
      businessId: business._id
    });

    business.ownerId = user._id;

    await user.save();
    await business.save();
    console.log(`[Seed] Created User & Business: ${business.businessName} (Code: ${business.businessCode})`);

    // 3. Create Sample Customers
    const lakshmiAddress = {
      name: 'Lakshmi Devi',
      houseNo: 'Flat 302, Sai Residency',
      street: 'Temple Road',
      area: 'Madhapur',
      city: 'Hyderabad',
      state: 'Telangana',
      pin: '500081',
      landmark: 'Near Ayyappa Temple',
      phone: '9876543210'
    };
    lakshmiAddress.formattedAddress = formatPostalAddress(lakshmiAddress);

    const customer1 = await Customer.create({
      businessId: business._id,
      name: 'Lakshmi Devi',
      phone: '919876543210',
      defaultAddress: lakshmiAddress
    });

    const customer2 = await Customer.create({
      businessId: business._id,
      name: 'Priya Sharma',
      phone: '919845012345',
      defaultAddress: null
    });
    console.log('[Seed] Created sample customers: Lakshmi Devi & Priya Sharma');

    // 4. Create Sample Orders
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const order1 = await Order.create({
      businessId: business._id,
      customerId: customer1._id,
      orderToken: 'K8f92LmQ',
      item: 'Banarasi Soft Silk Saree',
      amount: 1499,
      customerName: 'Lakshmi Devi',
      customerPhone: '919876543210',
      address: lakshmiAddress,
      addressSavedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      orderStatus: 'ready_for_payment',
      paymentStatus: 'pending',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      expiresAt
    });

    const order2 = await Order.create({
      businessId: business._id,
      customerId: customer2._id,
      orderToken: 'P9w24NzX',
      item: '1g Gold Matte Finish Choker Set',
      amount: 899,
      customerName: 'Priya Sharma',
      customerPhone: '919845012345',
      address: null,
      addressSavedAt: null,
      orderStatus: 'awaiting_address',
      paymentStatus: 'pending',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000),
      expiresAt
    });

    console.log(`[Seed] Created sample orders: Order #${order1.orderToken} and #${order2.orderToken}`);
    console.log('\n=============================================');
    console.log(' SEED COMPLETED SUCCESSFULLY');
    console.log('=============================================');
    console.log('Login credentials:');
    console.log('Email:    dealer@resellertools.com');
    console.log('Password: password123');
    console.log('---------------------------------------------');
    console.log(`Public Address Link: /address/${business.businessCode}`);
    console.log(`Public Order Link:   /order/${order1.orderToken}`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
