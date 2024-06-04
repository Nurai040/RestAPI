import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from '../interfaces/general';

interface FeedbackAttributes {
  id: number;
  from_user: number;
  to_user: number;
  content: string;
  company_name: string;
}

export class Feedback
  extends Model<FeedbackAttributes, Optional<FeedbackAttributes, 'id'>>
  implements FeedbackAttributes
{
  id: number;
  from_user: number;
  to_user: number;
  content: string;
  company_name: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    Feedback.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        from_user: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        to_user: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        company_name: {
          type: new DataTypes.STRING(128),
          allowNull: false,
        },
      },
      {
        tableName: 'feedbacks',
        underscored: true,
        sequelize,
      },
    );
  }

  static associate(models: Models, sequelize: Sequelize) {
    Feedback.belongsTo(models.user, {
      foreignKey: 'from_user',
      as: 'FromUser',
    });
    Feedback.belongsTo(models.user, {
      foreignKey: 'to_user',
      as: 'ToUser',
    });
  }
}
