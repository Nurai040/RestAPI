import { UserRole } from '../models/user.model';
import { Feedback } from '../models/feedback.model';
import { cachService } from './redis.service';

export class FeedbackService {
  async createFeedback(req: any, res: any) {
    const log = req.log;
    try {
      const { fromUser, companyName, toUser, context } = req.body;
      const feedback = await Feedback.create({
        from_user: fromUser,
        company_name: companyName,
        to_user: toUser,
        content: context,
      });
      await cachService.delByPattern('feedback_*');
      await cachService.delByPattern(`cv_${toUser}`);

      log.info(`New Feedback with ${feedback.id} id is created`);
      return res.status(201).json(feedback);
    } catch (error) {
      log.error('Error with creating feedback: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getFeedback(req: any, res: any) {
    const log = req.log;
    try {
      const pageSize: number = parseInt(req.query.pageSize as string) || 10;
      const page: number = parseInt(req.query.page as string) || 1;

      const cacheKey = `feedback_${page}_${pageSize}`;
      const cacheData = await cachService.get(cacheKey);
      if(cacheData){
        log.info(`Cached data is returned in fetching feedbacks`);
        return res.status(200).json(cacheData);
      }

      const { count, rows } = await Feedback.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      res.setHeader('X-total-count', count);
      await cachService.set(cacheKey, rows, 7200);

      log.info(`Fetching feedbacks`);
      return res.status(200).json(rows);
    } catch (error) {
      log.error('Error with fetching feedback: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getFeedbackById(req: any, res: any) {
    const log = req.log;
    try {
      const feedbackId = parseInt(req.params.id);
      const cacheKey = `feedback_${feedbackId}`;
      const cacheData = await cachService.get(cacheKey);

      if(cacheData){
        log.info(`Returning cached data of feedback with ${feedbackId} id`);
        return res.status(200).json(cacheData);
      }

      const currentFdbck = await Feedback.findByPk(feedbackId);

      if (!currentFdbck) {
        return res.status(404).json({ message: 'Not found' });
      }
      
      await cachService.set(cacheKey, currentFdbck, 7200);

      log.info(`Fetching the feedback with ${feedbackId} id`);
      return res.status(200).json(currentFdbck);
    } catch (error) {
      log.error('Error with fetching feedback by ID: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async updateFeedbackById(req: any, res: any) {
    const log = req.log;
    try {
      const { fromUser, companyName, toUser, context } = req.body;
      const fdbckId = parseInt(req.params.id);
      const currentFdbck = await Feedback.findByPk(fdbckId);

      if (!currentFdbck) {
        log.warn(`Trying to fetch nonexisting feedback, given id - ${fdbckId}`);
        return res.status(404).json({ message: 'Not found' });
      }

      if (
        req.user.id !== currentFdbck.from_user &&
        req.user.role !== UserRole.Admin
      ) {
        log.warn(`Unauthorized trying to update feedback with ${fdbckId} id`);
        return res
          .status(403)
          .json({ message: 'Unauthorized to update this feedback' });
      }
      if (fromUser) currentFdbck.from_user = fromUser;
      if (companyName) currentFdbck.company_name = companyName;
      if (toUser) currentFdbck.to_user = toUser;
      if (context) currentFdbck.content = context;

      await currentFdbck.save();
      await cachService.delByPattern('feedback_*');
      await cachService.delByPattern(`cv_${toUser}`);

      log.info(`Feedback with ${fdbckId} id is updated`);
      return res.status(200).json(currentFdbck);
    } catch (error) {
      log.error('Error with updating feedback: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async deleteFeedbackById(req: any, res: any) {
    const log = req.log;
    try {
      const fdbckId = parseInt(req.params.id);
      const currentFdbck = await Feedback.findByPk(fdbckId);
      const toUser = currentFdbck.to_user;
      if (!currentFdbck) {
        log.warn(`Trying to fetch nonexisting feedback, given id - ${fdbckId}`);
        return res.status(404).json({ message: 'Not found' });
      }

      if (
        req.user.id !== currentFdbck.from_user &&
        req.user.role !== UserRole.Admin
      ) {
        log.warn(`Unauthorized trying to update feedback with ${fdbckId} id`);
        return res
          .status(403)
          .json({ message: 'Unauthorized to delete this feedback' });
      }

      await currentFdbck.destroy();
      await cachService.delByPattern('feedback_*');
      await cachService.delByPattern(`cv_${toUser}`);

      log.info(`Feedback with ${fdbckId} id is deleted`);
      return res.status(200).json({ message: 'Deleted the feedback' });
    } catch (error) {
      log.error('Error with deleting feedback: ', {error});
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
}
