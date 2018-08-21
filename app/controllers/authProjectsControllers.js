const { Project, User, SessionProject } = require('../models');

module.exports = {
  async register(req, res, next) {
    try {
      const user = await User.findOne({
        where: {
          id: req.session.user.id,
        },
      });
      if (!req.body.title) {
        req.flash('error', 'Nome do Projeto em branco, favor incluir antes de salvar!');
        // res.render('dashboard');
        return res.redirect('show');
      }

      await Project.create({ ...req.body, UserId: user.id });
      req.flash('success', 'Projeto Cadastrado');

      // const projetos = await Project.findAll({ where: { UserId: req.session.user.id } });
      // const tamanho = Object.keys(projetos).length;
      return res.redirect('show');
    } catch (err) {
      return next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      await SessionProject.destroy({ where: { ProjectId: req.params.projectId } });
      await Project.destroy({ where: { id: req.params.projectId } });
      req.flash('success', 'Projeto deletado com sucesso');
      const projetos = await Project.findAll({ where: { UserId: req.session.user.id } });
      const tamanho = Object.keys(projetos).length;
      return res.render('dashboard', {
        projetos,
        tamanho,
        user: req.session.user.name,
      });
    } catch (err) {
      return next(err);
    }
  },
  async show(req, res, next) {
    try {
      const projetos = await Project.findAll({ where: { UserId: req.session.user.id } });
      const tamanho = Object.keys(projetos).length;
      return res.render('dashboard', { projetos, tamanho, user: req.session.user.name });
    } catch (err) {
      return next(err);
    }
  },
};
