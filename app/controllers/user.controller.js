const db = require('../models')
const User = db.user

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.create = (req, res) => {
  try {
    const { firstname, lastname, Email, Password, date_naissace } = req.boby
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
      if (!email.match(mailformat)) {
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
    if (!date_naissace) {
      return res.status(401).send({
        error: true,
        message: "L'une ou plusieurs données obligatoire sont manquantes",
      })
    } else {
    }
  } catch (error) {
    return res.status(500).send({
      error: true,
      message: error.message || 'Some error occurred while creating the user.',
    })
  }
}
