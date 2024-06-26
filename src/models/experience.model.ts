import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { Models } from '../interfaces/general';

interface ExperienceAttributes {
  id: number;
  user_id: number;
  company_name: string;
  role: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string;
}

export class Experience
  extends Model<ExperienceAttributes, Optional<ExperienceAttributes, 'id'>>
  implements ExperienceAttributes
{
  id: number;
  user_id: number;
  company_name: string;
  role: string;
  startDate: Date | null;
  endDate: Date | null;
  description: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  static defineSchema(sequelize: Sequelize) {
    Experience.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
        },
        company_name: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        role: {
          type: new DataTypes.STRING(256),
          allowNull: false,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'startDate',
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'endDate',
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
      },
      {
        tableName: 'experiences',
        underscored: true,
        sequelize,
      },
    );
  }

  static associate(models: Models, sequelize: Sequelize) {
    Experience.belongsTo(models.user, {
      foreignKey: 'user_id',
    });
  }
}
