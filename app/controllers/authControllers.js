const bcrypt = require('bcryptjs');
const { Project, User } = require('../models');

module.exports = {
  signin(req, res) {
    res.render('signin');
  },

  signup(req, res) {
    res.render('signup');
  },

  async register(req, res, next) {
    const { email } = req.body;

    try {
      if (await User.findOne({ where: { email } })) {
        req.flash('error', 'Usuário já cadastrado');
        return res.redirect('back');
      }
      const password = await bcrypt.hash(req.body.password, 5);

      await User.create({ ...req.body, password });

      req.flash('success', 'Usuário cadastrado com sucesso!');
      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  },

  async authenticate(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        req.flash('error', 'Email não cadastrado');
        return res.redirect('back');
      }
      if (!(await bcrypt.compare(password, user.password))) {
        req.flash('error', 'Senha não confere');
        return res.redirect('back');
      }

      req.session.user = user;

      const projetos = await Project.findAll({ where: { UserId: req.session.user.id } });
      const tamanho = Object.keys(projetos).length;

      return req.session.save(() => {
        res.render('dashboard', {
          user: req.session.user.name,
          projetos,
          tamanho,
        });
      });
    } catch (err) {
      return next(err);
    }
  },

  signout(req, res) {
    return req.session.destroy(() => {
      res.redirect('/');
    });
  },
};
