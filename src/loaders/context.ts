import {Context} from '../interfaces/general';
import {AuthService} from '../services/auth.service';

export const loadContext = async (): Promise<Context> => {
  return {
    services: {
      authService: new AuthService(),
    }
  };
}
