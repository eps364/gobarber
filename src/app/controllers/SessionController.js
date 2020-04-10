import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';

require('dotenv').config();

class SessionController {
  async index(request, response) {
    return response.json({ message: 'Not implements' });
  }

  async show(request, response) {
    return response.json({ message: 'Not implements' });
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().required().min(6),
    });
    if (!(await schema.isValid(request.body)))
      return response.status(400).json({ error: 'Validation fails' });
    const { email, password } = request.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) return response.status(401).json({ error: 'User nor found' });
    if (!(await user.checkPassword(password)))
      return response.status(401).json({ error: 'Password dows not match' });

    const { id, name } = user;

    return response.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign(
        {
          id,
          name,
          email,
        },
        process.env.SECRET,
        {
          expiresIn: process.env.EXPIRES,
        }
      ),
    });
  }

  async update(request, response) {
    return response.json({ message: 'Not implements' });
  }

  async delete(request, response) {
    return response.json({ message: 'Not implements' });
  }
}

export default new SessionController();
