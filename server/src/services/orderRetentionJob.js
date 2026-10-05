import cron from 'node-cron';
import { Order } from '../models/Order.js';

/**
 * Perform lazy/scheduled expiration of orders
 * Soft-deletes orders past expiresAt
 */
export const runOrderRetentionCleanup = async () => {
  try {
    const now = new Date();

    // 1. Soft-delete expired orders
    const expiredResult = await Order.updateMany(
      {
        deletedAt: null,
        expiresAt: { $lt: now },
        orderStatus: { $ne: 'completed' }
      },
      {
        $set: {
          deletedAt: now,
          orderStatus: 'expired'
        }
      }
    );

    if (expiredResult.modifiedCount > 0) {
      console.log(`[Retention] Soft-deleted ${expiredResult.modifiedCount} expired orders.`);
    }

    // 2. Permanently prune soft-deleted orders older than 60 days
    const purgeThreshold = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const purgedResult = await Order.deleteMany({
      deletedAt: { $ne: null, $lt: purgeThreshold }
    });

    if (purgedResult.deletedCount > 0) {
      console.log(`[Retention] Permanently purged ${purgedResult.deletedCount} old soft-deleted orders.`);
    }
  } catch (error) {
    console.error('[Retention Job Error]:', error.message);
  }
};

/**
 * Initialize cron schedule: runs every hour
 */
export const initRetentionScheduler = () => {
  // Run every hour: '0 * * * *'
  cron.schedule('0 * * * *', async () => {
    console.log('[Retention] Running hourly order retention cleanup job...');
    await runOrderRetentionCleanup();
  });
  console.log('[Retention] Scheduled hourly order retention cleanup.');
};
