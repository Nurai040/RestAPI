import { UserRole } from '../models/user.model';
import { Feedback } from '../models/feedback.model';

export class FeedbackService {
  async createFeedback(req: any, res: any) {
    try {
      const { fromUser, companyName, toUser, context } = req.body;
      const feedback = await Feedback.create({
        from_user: fromUser,
        company_name: companyName,
        to_user: toUser,
        content: context,
      });
      return res.status(201).json(feedback);
    } catch (error) {
      console.error('Error with creating feedback: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getFeedback(req: any, res: any) {
    try {
      const pageSize: number = parseInt(req.query.pageSize as string) || 10;
      const page: number = parseInt(req.query.page as string) || 1;

      const { count, rows } = await Feedback.findAndCountAll({
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      res.setHeader('X-total-count', count);
      return res.status(200).json(rows);
    } catch (error) {
      console.error('Error with fetching feedback: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async getFeedbackById(req: any, res: any) {
    try {
      const feedbackId = parseInt(req.params.id);
      const currentFdbck = await Feedback.findByPk(feedbackId);

      if (!currentFdbck) {
        return res.status(404).json({ message: 'Not found' });
      }
      return res.status(200).json(currentFdbck);
    } catch (error) {
      console.error('Error with fetching feedback by ID: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async updateFeedbackById(req: any, res: any) {
    try {
      const { fromUser, companyName, toUser, context } = req.body;
      const fdbckId = parseInt(req.params.id);
      const currentFdbck = await Feedback.findByPk(fdbckId);

      if (!currentFdbck) {
        return res.status(404).json({ message: 'Not found' });
      }

      if (
        req.user.id !== currentFdbck.from_user &&
        req.user.role !== UserRole.Admin
      ) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to update this feedback' });
      }
      if (fromUser) currentFdbck.from_user = fromUser;
      if (companyName) currentFdbck.company_name = companyName;
      if (toUser) currentFdbck.to_user = toUser;
      if (context) currentFdbck.content = context;

      await currentFdbck.save();

      return res.status(200).json(currentFdbck);
    } catch (error) {
      console.error('Error with updating feedback: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }

  async deleteFeedbackById(req: any, res: any) {
    try {
      const fdbckId = parseInt(req.params.id);
      const currentFdbck = await Feedback.findByPk(fdbckId);

      if (!currentFdbck) {
        return res.status(404).json({ message: 'Not found' });
      }

      if (
        req.user.id !== currentFdbck.from_user &&
        req.user.role !== UserRole.Admin
      ) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to delete this feedback' });
      }

      await currentFdbck.destroy();

      return res.status(200).json({ message: 'Deleted the feedback' });
    } catch (error) {
      console.error('Error with deleting feedback: ', error);
      return res
        .status(505)
        .json({ message: 'Something went wrong on the server' });
    }
  }
}
