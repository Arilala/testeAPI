module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      Email: {
        type: String,
        required: true,
      },
      Password: {
        type: String,
        required: true,
      },
      date_naissance: {
        type: Date,
        required: true,
      },
      /**
       * 0: femmes
       * 1: hommes
       */
      sexe: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true },
  )

  schema.method('toJSON', function () {
    const { __v, _id, Password, updatedAt, ...object } = this.toObject()
    //object.id = _id
    return object
  })

  const User = mongoose.model('User', schema)
  return User
}
