const db = require('../models')
const User = db.user

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const moment = require('moment')
const { TokenExpiredError } = jwt
const config = require('../config/auth.config')

exports.create = (req, res) => {
  try {
    const {
      firstname,
      lastname,
      Email,
      Password,
      date_naissance,
      sexe,
    } = req.body
    if (!firstname) {
      return res.status(401).send({
        error: true,
        message: "L'une ou plusieurs données obligatoire sont manquantes",
      })
    }
    if (!lastname) {
      return res.status(401).send({
        error: true,
        message: "L'une ou plusieurs données obligatoire sont manquantes",
      })
    }
    if (!Email) {
      return res.status(401).send({
        error: true,
        message: "L'une ou plusieurs données obligatoire sont manquantes",
      })
    } else {
      var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!Email.match(mailformat)) {
        return res.status(401).send({
          error: true,
          message: "Votre email n'ai pas correct",
        })
      }
    }
    if (!Password) {
      return res.status(401).send({
        error: true,
        message: "L'une ou plusieurs données obligatoire sont manquantes",
      })
    }
    if (!date_naissance) {
      return res.status(401).send({
        error: true,
        message: "L'une ou plusieurs données obligatoire sont manquantes",
      })
    } else {
      if (!moment(!date, 'YYYY-MM-DD', true).isValid()) {
        return res.status(401).send({
          error: true,
          message: "l'un des données obligatoire ne sont pas conformes",
        })
      }
    }

    User.findOne({
      Email,
    }).exec((err, user) => {
      if (err) {
        return res.status(500).send({ error: true, message: err })
      }

      if (user) {
        return res.status(401).send({ error: true, message: 'Email existe' })
      }
    })

    const user = new User({
      firstname,
      lastname,
      Email,
      Password: bcrypt.hashSync(Password, 10),
      date_naissance,
      sexe,
    })
    user.save((err, user) => {
      if (err) {
        res.status(500).send(err)
      }

      const data = {
        id: user.id,
        //Email: user.Email,
      }
      const token = jwt.sign(data, config.secret, {
        expiresIn: config.jwtExpiration,
      })

      return res.status(201).send({
        error: false,
        message: "L'utilisateur a bien été créé avec succès",
        tokens: {
          token,
          createdAt: user.createdAt,
        },
      })
    })
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: error.message || 'erreur',
    })
  }
}

exports.login = (req, res) => {
  try {
    const { Email, Password } = req.body

    if (!Email) {
      return res.status(401).send({
        error: true,
        message: "L'email/password est manquant",
      })
    }
    if (!Password) {
      return res.status(401).send({
        error: true,
        message: "L'email/password est manquant",
      })
    }

    User.findOne({
      Email,
    }).exec((err, user) => {
      if (err) {
        return res.status(500).send({ error: true, message: err })
      }

      if (!user) {
        return res.status(401).send({
          error: true,
          message: 'Votre email ou password est erroné',
        })
      } else {
        if (!bcrypt.compareSync(Password, user.Password)) {
          return res.status(401).send({
            error: true,
            message: 'Votre email ou password est erroné',
          })
        }

        const data = {
          id: user.id,
          //Email: user.Email,
        }
        const token = jwt.sign(data, config.secret, {
          expiresIn: config.jwtExpiration,
        })

        return res.status(201).send({
          error: false,
          message: "L'utilisateur a bien été créé avec succès",
          tokens: {
            token,
            createdAt: user.createdAt,
          },
        })
      }
    })
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: error.message || 'erreur',
    })
  }
}

exports.findOne = (req, res) => {
  try {
    const { token } = req.params

    if (!token) {
      return res.status(401).send({
        error: true,
        message: "Le token n'est pas conforme",
      })
    }
    const decoded = jwt.verify(token, 'abcd')
    const user = decoded

    User.findById(user.id)
      .then((data) => {
        if (!data) {
          return res
            .status(401)
            .send({ error: true, message: "Le token envoyer n'existe pas" })
        } else {
          return res.status(201).send({
            error: false,

            user: data,
          })
        }
      })
      .catch((err) => {
        res
          .status(401)
          .send({ error: true, message: "Le token envoyer n'existe pas" })
      })
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).send({
        error: true,
        message: "Votre token n'ai pas plus valide, veuillez reinitialiser",
      })
    } else {
      return res.status(500).send({
        error: true,
        message: error.message || 'erreur',
      })
    }
  }
}

exports.update = (req, res) => {
  try {
    const { token } = req.params

    let isDataEmpty = true

    if (!token) {
      return res.status(401).send({
        error: true,
        message: "Le token n'est pas conforme",
      })
    }

    const { firstname, lastname, date_naissance, sexe } = req.body

    const data = {}

    if (firstname) {
      data.firstname = firstname
      isDataEmpty = false
    }

    if (lastname) {
      data.lastname = lastname
      isDataEmpty = false
    }

    if (date_naissance) {
      data.date_naissance = date_naissance
      isDataEmpty = false
    }

    if (sexe) {
      data.sexe = sexe
      isDataEmpty = false
    }

    if (isDataEmpty) {
      return res
        .status(401)
        .send({ error: true, message: "Aucun données n'a été envoyée" })
    }

    const decoded = jwt.verify(token, 'abcd')
    const user = decoded

    User.findByIdAndUpdate(user.id, data, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          return res
            .status(401)
            .send({ error: true, message: "Le token envoyer n'existe pas" })
        } else {
          return res.status(200).send({
            error: false,
            message: "L'utilisateur a été modifiée succés",
          })
        }
      })
      .catch((err) => {
        return res
          .status(401)
          .send({ error: true, message: "Le token envoyer n'existe pas" })
      })
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).send({
        error: true,
        message: "Votre token n'ai pas plus valide, veuillez reinitialiser",
      })
    } else {
      return res.status(500).send({
        error: true,
        message: error.message || 'erreur',
      })
    }
  }
}

exports.findAll = (req, res) => {
  try {
    const { token } = req.params
    if (!token) {
      return res.status(401).send({
        error: true,
        message: "Le token n'est pas conforme",
      })
    }
    const decoded = jwt.verify(token, 'abcd')
    const user = decoded

    User.findById(user.id)
      .then((data) => {
        if (!data) {
          return res
            .status(401)
            .send({ error: true, message: "Le token envoyer n'existe pas" })
        } else {
          User.find({})
            .then((data) => {
              return res.status(200).send({
                error: false,
                users: data,
              })
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || 'erre.',
              })
            })
        }
      })
      .catch((err) => {
        res
          .status(401)
          .send({ error: true, message: "Le token envoyer n'existe pas" })
      })
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).send({
        error: true,
        message: "Votre token n'ai pas plus valide, veuillez reinitialiser",
      })
    } else {
      return res.status(500).send({
        error: true,
        message: error.message || 'erreur',
      })
    }
  }
}

exports.delete = (req, res) => {
  try {
    const { token } = req.params

    if (!token) {
      return res.status(401).send({
        error: true,
        message: "Le token n'est pas conforme",
      })
    }

    const decoded = jwt.verify(token, 'abcd')
    const user = decoded

    User.findByIdAndRemove(user.id)
      .then((data) => {
        if (!data) {
          return res
            .status(401)
            .send({ error: true, message: "Le token envoyer n'existe pas" })
        } else {
          return res.status(200).send({
            error: false,
            message: "L'utilisateur a été déconnecté succés",
          })
        }
      })
      .catch((err) => {
        return res
          .status(401)
          .send({ error: true, message: "Le token envoyer n'existe pas" })
      })
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).send({
        error: true,
        message: "Votre token n'ai pas plus valide, veuillez reinitialiser",
      })
    } else {
      return res.status(500).send({
        error: true,
        message: error.message || 'erreur',
      })
    }
  }
}
