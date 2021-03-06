import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async index(request, response) {
    const users = await User.findAll();
    return response.json(users);
  }

  async show(request, response) {
    const user = await User.findByPk(request.params.id);
    return response.json(user);
  }

  async store(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(request.body)))
      return request.status(400).json({ erro: 'Validation fails' });

    const userExists = await User.findOne({
      where: { email: request.body.email },
    });
    if (userExists)
      return response.status(400).json({ error: 'User already exists.' });

    const { id, name, email, provider } = await User.create(request.body);
    return response.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required().min(6) : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(request.body)))
      return response.status(400).json({ error: 'Validation fails' });

    const { email, oldPassword } = request.body;

    const user = await User.findByPk(request.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists)
        return response.status(400).json({ error: 'User already exists' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword)))
      return response.status(401).json({ error: 'Password does not match' });

    const { id, name, provider } = await user.update(request.body);
    return response.json({
      id,
      name,
      email,
      provider,
    });
  }

  async delete(request, response) {
    return response.status(200).json({ message: 'OK' });
  }
}

export default new UserController();
