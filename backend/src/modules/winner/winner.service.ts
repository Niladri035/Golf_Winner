import { Winner } from '../../models/Winner';
import { Transaction } from '../../models/Transaction';
import { cloudinary } from '../../config/cloudinary';
import { ApiError } from '../../utils/apiError';
import { logger } from '../../utils/logger';
import { Readable } from 'stream';

export class WinnerService {
  async getMyWinnings(userId: string) {
    return Winner.find({ userId }).populate('drawId', 'drawnNumbers month').sort({ createdAt: -1 }).lean();
  }

  async uploadProof(winnerId: string, userId: string, fileBuffer: Buffer, mimeType: string): Promise<InstanceType<typeof Winner>> {
    const winner = await Winner.findOne({ _id: winnerId, userId });
    if (!winner) throw ApiError.notFound('Winner record not found');

    if (winner.status !== 'awaiting_proof') {
      throw ApiError.conflict('Proof already submitted');
    }

    // Stream upload to Cloudinary
    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'winner-proofs', resource_type: 'image' },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error('Upload failed'));
          resolve({ secure_url: result.secure_url, public_id: result.public_id });
        }
      );
      Readable.from(fileBuffer).pipe(uploadStream);
    });

    winner.proofImage = uploadResult.secure_url;
    winner.proofPublicId = uploadResult.public_id;
    winner.status = 'pending_review';
    await winner.save();

    logger.info('Winner proof uploaded', { winnerId, userId });
    return winner;
  }

  async verifyWinner(winnerId: string, adminId: string, approve: boolean, rejectionReason?: string): Promise<InstanceType<typeof Winner>> {
    const winner = await Winner.findById(winnerId);
    if (!winner) throw ApiError.notFound('Winner not found');

    if (winner.status !== 'pending_review') {
      throw ApiError.conflict('Winner is not pending review');
    }

    winner.status = approve ? 'verified' : 'rejected';
    winner.reviewedBy = adminId as unknown as typeof winner.reviewedBy;
    winner.reviewedAt = new Date();
    if (!approve && rejectionReason) winner.rejectionReason = rejectionReason;
    if (approve) winner.paymentStatus = 'pending';

    await winner.save();

    if (approve) {
      await Transaction.findOneAndUpdate(
        { referenceId: winner.drawId.toString(), userId: winner.userId, type: 'prize' },
        { status: 'completed' }
      );
    }

    logger.info('Winner verification completed', { winnerId, approve, adminId });
    return winner;
  }

  async getAllWinners(filters: { status?: string; page?: number; limit?: number } = {}) {
    const { status, page = 1, limit = 20 } = filters;
    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const [winners, total] = await Promise.all([
      Winner.find(query)
        .populate('userId', 'name email')
        .populate('drawId', 'month drawnNumbers')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Winner.countDocuments(query),
    ]);

    return { winners, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const winnerService = new WinnerService();
