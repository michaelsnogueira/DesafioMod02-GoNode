const { Project, SessionProject } = require('../models');

module.exports = {
  async show(req, res, next) {
    try {
      const projeto = await Project.findOne({ where: { id: req.params.id } });
      const sessionProject = await SessionProject.findAll({ where: { ProjectId: projeto.id } });
      return res.render('project', {
        user: req.session.user.name,
        nameProject: projeto.title,
        projectId: projeto.id,
        sessionProject,
      });
    } catch (err) {
      return next(err);
    }
  },
  async showSession(req, res, next) {
    try {
      const session = await SessionProject.findOne({ where: { id: req.params.id } });
      const projeto = await Project.findOne({ where: { id: session.ProjectId } });
      const sessionProject = await SessionProject.findAll({ where: { ProjectId: projeto.id } });
      return res.render('project', {
        user: req.session.user.name,
        nameProject: projeto.title,
        projectId: projeto.id,
        session,
        sessionProject,
      });
    } catch (err) {
      return next(err);
    }
  },
  async register(req, res, next) {
    try {
      const { projectId } = req.params;
      await SessionProject.create({ ...req.body, ProjectId: projectId });
      req.flash('success', 'Sessão Cadastrado com sucesso');
      return res.redirect('back');
    } catch (err) {
      req.flash('error', 'Erro ao tentar gravar a sessão');
      return next(err);
    }
  },
  async destroy(req, res, next) {
    try {
      const beforeSession = await SessionProject.findOne({ where: { id: req.params.id } });
      await SessionProject.destroy({ where: { id: req.params.id } });
      const session = await SessionProject.findOne({
        where: { ProjectId: beforeSession.ProjectId },
      });
      const projeto = await Project.findOne({ where: { id: session.ProjectId } });
      req.flash('success', 'Sessão deletada com sucesso');
      const sessionProject = await SessionProject.findAll({ where: { ProjectId: projeto.id } });
      return res.render('project', {
        user: req.session.user.name,
        nameProject: projeto.title,
        projectId: projeto.id,
        session,
        sessionProject,
      });
    } catch (err) {
      return next(err);
    }
  },
};
